mod application;
mod domain;
mod infrastructure;

use application::commands::{
    create_project, delete_project, launch_project, list_projects, update_project,
};
use infrastructure::StoreProjectRepository;
use std::sync::Mutex;
use tauri::Manager;
use tauri_plugin_store::StoreExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let store = app.store("projects.json")?;
            let repo = StoreProjectRepository::new(store);
            let repo: Box<dyn domain::ports::ProjectRepository> = Box::new(repo);
            app.manage(Mutex::new(repo));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_project,
            delete_project,
            launch_project,
            list_projects,
            update_project
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
