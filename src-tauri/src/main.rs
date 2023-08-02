// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn test() -> Result<usize, String> {
  let current_dir = env::current_dir().map_err(|e| e.to_string())?;
  let current_dir_str = current_dir.to_str().ok_or_else(|| "Invalid Unicode in path".to_string())?;

  let mut count = 0;
  for entry in fs::read_dir(current_dir_str).map_err(|e| e.to_string())? {
    count += 1;
  }
  Ok(count)}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![test])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
