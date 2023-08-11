// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cwd;
mod open;
mod search;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![cwd::get_dir_contents, cwd::get_cwd, open::open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
