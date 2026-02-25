use crate::{crypto, db};
use rusqlite::Connection;
use serde::Deserialize;
use sha2::{Digest, Sha256};
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

fn hash_passphrase(passphrase: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(passphrase.as_bytes());
    format!("{:x}", hasher.finalize())
}

#[tauri::command]
pub fn has_vault_passphrase(state: tauri::State<'_, AppState>) -> Result<bool, String> {
    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    let val = db::get_setting(&conn, "vault_passphrase_hash")?;
    Ok(val.is_some())
}

#[tauri::command]
pub fn set_vault_passphrase(
    state: tauri::State<'_, AppState>,
    passphrase: String,
) -> Result<(), String> {
    let hash = hash_passphrase(&passphrase);
    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    db::set_setting(&conn, "vault_passphrase_hash", &hash)
}

#[tauri::command]
pub fn verify_vault_passphrase(
    state: tauri::State<'_, AppState>,
    passphrase: String,
) -> Result<bool, String> {
    let hash = hash_passphrase(&passphrase);
    let conn = state.db.lock().map_err(|e| format!("Lock error: {e}"))?;
    let stored = db::get_setting(&conn, "vault_passphrase_hash")?;
    match stored {
        Some(stored_hash) => Ok(stored_hash == hash),
        None => Err("No passphrase set".into()),
    }
}
