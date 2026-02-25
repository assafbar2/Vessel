use crate::{crypto, db};
use rusqlite::Connection;
use serde::Deserialize;
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use std::sync::Mutex;

pub struct AppState {
    pub db: Mutex<Connection>,
    pub key: [u8; 32],
}

#[derive(Deserialize)]
pub struct SessionMetadataInput {
    pub average_vibe: String,
    pub dominant_state: String,
    pub duration_ms: u64,
    pub word_count: u32,
}

#[tauri::command]
pub fn save_session(
    state: tauri::State<'_, AppState>,
    content: String,
    metadata: SessionMetadataInput,
) -> Result<(), String> {
    let id = uuid::Uuid::new_v4().to_string();
    let created_at = chrono::Utc::now().to_rfc3339();
    let encrypted_content = crypto::encrypt(content.as_bytes(), &state.key)?;

    let record = db::SessionRecord {
        id,
        encrypted_content,
        average_vibe: metadata.average_vibe,
        dominant_state: metadata.dominant_state,
        duration_ms: metadata.duration_ms,
        word_count: metadata.word_count,
        created_at,
    };

    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    db::save_session(&conn, &record)
}

#[tauri::command]
pub fn load_session_list(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<db::SessionMeta>, String> {
    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    db::load_session_list(&conn)
}

#[tauri::command]
pub fn load_session_content(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<String, String> {
    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    let encrypted = db::load_session_content(&conn, &id)?;
    let plaintext = crypto::decrypt(&encrypted, &state.key)?;
    String::from_utf8(plaintext).map_err(|e| format!("UTF-8 error: {e}"))
}

#[tauri::command]
pub fn delete_session(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    db::delete_session(&conn, &id)
}

fn hash_passphrase(passphrase: &str) -> Result<String, String> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(passphrase.as_bytes(), &salt)
        .map(|h| h.to_string())
        .map_err(|e| format!("Hashing error: {e}"))
}

fn verify_passphrase(passphrase: &str, stored_hash: &str) -> Result<bool, String> {
    let parsed = PasswordHash::new(stored_hash)
        .map_err(|e| format!("Hash parse error: {e}"))?;
    Ok(Argon2::default()
        .verify_password(passphrase.as_bytes(), &parsed)
        .is_ok())
}

#[tauri::command]
pub fn has_vault_passphrase(state: tauri::State<'_, AppState>) -> Result<bool, String> {
    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    let val = db::get_setting(&conn, "vault_passphrase_hash")?;
    Ok(val.map_or(false, |v| !v.is_empty()))
}

#[tauri::command]
pub fn set_vault_passphrase(
    state: tauri::State<'_, AppState>,
    passphrase: String,
) -> Result<(), String> {
    let hash = hash_passphrase(&passphrase)?;
    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    db::set_setting(&conn, "vault_passphrase_hash", &hash)
}

#[tauri::command]
pub fn verify_vault_passphrase(
    state: tauri::State<'_, AppState>,
    passphrase: String,
) -> Result<bool, String> {
    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    let stored = db::get_setting(&conn, "vault_passphrase_hash")?;
    match stored {
        Some(ref stored_hash) => {
            // Migrate legacy SHA-256 hashes (no salt, no KDF) created before v0.3.0.
            // Clear the old hash so the user is prompted to set a new passphrase.
            if !stored_hash.starts_with("$argon2") {
                db::set_setting(&conn, "vault_passphrase_hash", "")?;
                return Err("passphrase_reset_required".into());
            }
            verify_passphrase(&passphrase, stored_hash)
        }
        None => Err("No passphrase set".into()),
    }
}
