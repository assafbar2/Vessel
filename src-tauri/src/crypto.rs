use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD as B64, Engine};
use rand::RngCore;
use std::sync::OnceLock;

static ENCRYPTION_KEY: OnceLock<[u8; 32]> = OnceLock::new();

/// Retrieve or generate the 256-bit encryption key.
/// Stored in the OS keychain via the `keyring` crate.
pub fn get_or_create_key() -> Result<[u8; 32], String> {
    if let Some(key) = ENCRYPTION_KEY.get() {
        return Ok(*key);
    }

    let entry = keyring::Entry::new("vessel", "encryption-key")
        .map_err(|e| format!("Keyring init error: {e}"))?;

    let key = match entry.get_password() {
        Ok(encoded) => {
            let bytes = B64
                .decode(&encoded)
                .map_err(|e| format!("Key decode error: {e}"))?;
            if bytes.len() != 32 {
                return Err(format!("Invalid key length: {}", bytes.len()));
            }
            let mut key = [0u8; 32];
            key.copy_from_slice(&bytes);
            key
        }
        Err(keyring::Error::NoEntry) => {
            let mut key = [0u8; 32];
            OsRng.fill_bytes(&mut key);
            let encoded = B64.encode(&key);
            entry
                .set_password(&encoded)
                .map_err(|e| format!("Keyring store error: {e}"))?;
            key
        }
        Err(e) => return Err(format!("Keyring read error: {e}")),
    };

    let _ = ENCRYPTION_KEY.set(key);
    Ok(key)
}

/// Encrypt plaintext with AES-256-GCM. Returns base64(nonce || ciphertext || tag).
pub fn encrypt(plaintext: &[u8], key: &[u8; 32]) -> Result<String, String> {
    let cipher = Aes256Gcm::new_from_slice(key)
        .map_err(|e| format!("Cipher init error: {e}"))?;

    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext = cipher
        .encrypt(nonce, plaintext)
        .map_err(|e| format!("Encryption error: {e}"))?;

    // nonce (12) || ciphertext+tag
    let mut combined = Vec::with_capacity(12 + ciphertext.len());
    combined.extend_from_slice(&nonce_bytes);
    combined.extend_from_slice(&ciphertext);

    Ok(B64.encode(&combined))
}

/// Decrypt a base64(nonce || ciphertext || tag) blob.
pub fn decrypt(encoded: &str, key: &[u8; 32]) -> Result<Vec<u8>, String> {
    let combined = B64
        .decode(encoded)
        .map_err(|e| format!("Base64 decode error: {e}"))?;

    if combined.len() < 13 {
        return Err("Ciphertext too short".into());
    }

    let (nonce_bytes, ciphertext) = combined.split_at(12);
    let nonce = Nonce::from_slice(nonce_bytes);

    let cipher = Aes256Gcm::new_from_slice(key)
        .map_err(|e| format!("Cipher init error: {e}"))?;

    cipher
        .decrypt(nonce, ciphertext)
        .map_err(|e| format!("Decryption error: {e}"))
}
