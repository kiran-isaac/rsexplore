// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::fs;
use std::path::PathBuf;

mod cwd;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![cwd::get_dir_contents, cwd::get_cwd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
