mod commands;
mod crypto;
mod db;

use commands::AppState;
use std::sync::Mutex;

use tauri::menu::{MenuBuilder, SubmenuBuilder};
use tauri::{Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // — Encryption key —
            let key = crypto::get_or_create_key()
                .map_err(|e| Box::new(std::io::Error::new(std::io::ErrorKind::Other, e)))?;

            // — Database —
            let data_dir = app
                .path()
                .app_data_dir()
                .map_err(|e| Box::new(std::io::Error::new(std::io::ErrorKind::Other, e.to_string())))?;
            let conn = db::init_db(&data_dir)
                .map_err(|e| Box::new(std::io::Error::new(std::io::ErrorKind::Other, e)))?;

            app.manage(AppState {
                db: Mutex::new(conn),
                key,
            });

            // — Application Menu —
            let app_submenu = SubmenuBuilder::new(app, "Vessel")
                .about(None)
                .separator()
                .services()
                .separator()
                .hide()
                .hide_others()
                .show_all()
                .separator()
                .quit()
                .build()?;

            let help_submenu = SubmenuBuilder::new(app, "Help")
                .text("show-help", "Vessel Guide")
                .build()?;

            let menu = MenuBuilder::new(app)
                .item(&app_submenu)
                .item(&help_submenu)
                .build()?;

            app.set_menu(menu)?;

            app.on_menu_event(|app_handle, event| {
                if event.id().as_ref() == "show-help" {
                    let _ = app_handle.emit("show-help", ());
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::save_session,
            commands::load_session_list,
            commands::load_session_content,
            commands::delete_session,
            commands::has_vault_passphrase,
            commands::set_vault_passphrase,
            commands::verify_vault_passphrase,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Vessel");
}
