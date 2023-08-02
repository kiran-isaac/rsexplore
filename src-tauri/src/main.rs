// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
struct FileMetadata {
    name: String,
    path: String,
    size: u64,
    is_dir: bool,
    children: Option<Vec<FileMetadata>>,
}

#[tauri::command]
fn walk_from(drive_path: String) -> Result<String, String> {
    let mut root = FileMetadata {
        name: drive_path.clone(),
        path: drive_path.clone(),
        size: 0,
        is_dir: true,
        children: Some(Vec::new()),
    };
    walk_dir(&mut root, PathBuf::from(drive_path)).map_err(|e| e.to_string())?;
    let json_str = serde_json::to_string(&root).map_err(|e| e.to_string())?;
    std::fs::write("cache.json", json_str.clone()).unwrap();
    Ok(json_str)
}

fn walk_dir(parent: &mut FileMetadata, path: PathBuf) -> Result<(), std::io::Error> {
    for entry in fs::read_dir(path)? {
        let entry = entry?;
        let metadata = entry.metadata()?;
        let is_dir = metadata.is_dir();
        let size = metadata.len();
        let name = entry
            .file_name()
            .into_string()
            .unwrap_or_else(|_| String::from("Invalid Unicode in path"));
        let path_str = entry
            .path()
            .to_str()
            .unwrap_or_else(|| "Invalid Unicode in path")
            .to_string();
        let mut file_metadata = FileMetadata {
            name,
            path: path_str.clone(),
            size,
            is_dir,
            children: None,
        };
        if is_dir {
            file_metadata.children = Some(Vec::new());
            walk_dir(&mut file_metadata, PathBuf::from(path_str))?;
        }
        parent.children.as_mut().unwrap().push(file_metadata);
        parent.size += size;
    }
    Ok(())
}

#[tauri::command]
fn get_cwd() -> Result<String, String> {
    let cwd = std::env::current_dir().map_err(|e| e.to_string())?;
    let cwd_str = cwd
        .to_str()
        .unwrap_or_else(|| "Invalid Unicode in path")
        .to_string();
    Ok(cwd_str)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![walk_from, get_cwd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
