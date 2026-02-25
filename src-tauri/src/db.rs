use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Serialize, Deserialize, Clone)]
pub struct SessionRecord {
    pub id: String,
    pub encrypted_content: String,
    pub average_vibe: String,
    pub dominant_state: String,
    pub duration_ms: u64,
    pub word_count: u32,
    pub created_at: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SessionMeta {
    pub id: String,
    pub average_vibe: String,
    pub dominant_state: String,
    pub duration_ms: u64,
    pub word_count: u32,
    pub created_at: String,
}

/// Initialize the SQLite database and run migrations.
pub fn init_db(app_data_dir: &Path) -> Result<Connection, String> {
    std::fs::create_dir_all(app_data_dir)
        .map_err(|e| format!("Failed to create data dir: {e}"))?;

    let db_path = app_data_dir.join("vessel.db");
    let conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to open database: {e}"))?;

    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS sessions (
            id              TEXT PRIMARY KEY,
            encrypted_content TEXT NOT NULL,
            average_vibe    TEXT NOT NULL,
            dominant_state  TEXT NOT NULL,
            duration_ms     INTEGER NOT NULL,
            word_count      INTEGER NOT NULL,
            created_at      TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );",
    )
    .map_err(|e| format!("Migration failed: {e}"))?;

    Ok(conn)
}

pub fn get_setting(conn: &Connection, key: &str) -> Result<Option<String>, String> {
    match conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        params![key],
        |row| row.get(0),
    ) {
        Ok(val) => Ok(Some(val)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(format!("Setting read error: {e}")),
    }
}

pub fn set_setting(conn: &Connection, key: &str, value: &str) -> Result<(), String> {
    conn.execute(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?1, ?2)",
        params![key, value],
    )
    .map_err(|e| format!("Setting write error: {e}"))?;
    Ok(())
}

pub fn save_session(conn: &Connection, record: &SessionRecord) -> Result<(), String> {
    conn.execute(
        "INSERT INTO sessions (id, encrypted_content, average_vibe, dominant_state, duration_ms, word_count, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            record.id,
            record.encrypted_content,
            record.average_vibe,
            record.dominant_state,
            record.duration_ms,
            record.word_count,
            record.created_at,
        ],
    )
    .map_err(|e| format!("Insert failed: {e}"))?;
    Ok(())
}

pub fn load_session_list(conn: &Connection) -> Result<Vec<SessionMeta>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, average_vibe, dominant_state, duration_ms, word_count, created_at
             FROM sessions ORDER BY created_at DESC",
        )
        .map_err(|e| format!("Query prepare failed: {e}"))?;

    let rows = stmt
        .query_map([], |row| {
            Ok(SessionMeta {
                id: row.get(0)?,
                average_vibe: row.get(1)?,
                dominant_state: row.get(2)?,
                duration_ms: row.get(3)?,
                word_count: row.get(4)?,
                created_at: row.get(5)?,
            })
        })
        .map_err(|e| format!("Query failed: {e}"))?;

    let mut sessions = Vec::new();
    for row in rows {
        sessions.push(row.map_err(|e| format!("Row read error: {e}"))?);
    }
    Ok(sessions)
}

pub fn load_session_content(conn: &Connection, id: &str) -> Result<String, String> {
    conn.query_row(
        "SELECT encrypted_content FROM sessions WHERE id = ?1",
        params![id],
        |row| row.get(0),
    )
    .map_err(|e| format!("Session not found: {e}"))
}

pub fn delete_session(conn: &Connection, id: &str) -> Result<(), String> {
    conn.execute("DELETE FROM sessions WHERE id = ?1", params![id])
        .map_err(|e| format!("Delete failed: {e}"))?;
    Ok(())
}
