use serde::{Deserialize, Serialize};
use serde_json::{json};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
struct FileMetadata {
    name: String,
    size: u64,
    is_dir: bool,
}

#[tauri::command]
pub fn get_cwd() -> Result<String, String> {
    let cwd = std::env::current_dir().map_err(|e| e.to_string())?;
    let cwd_str = cwd
        .to_str()
        .unwrap_or_else(|| "Invalid Unicode in path")
        .to_string();
    Ok(cwd_str)
}

#[tauri::command]
pub fn get_dir_contents(dir: String) -> Result<String, String> {
    let dir = PathBuf::from(dir);
    let mut dir_contents: Vec<FileMetadata> = Vec::new();

    for entry in fs::read_dir(dir).map_err(|e| e.to_string())? {
        match entry {
            Ok(entry) => {
                let path = entry.path();
                let metadata = entry.metadata().map_err(|e| e.to_string())?;
                let file_type = metadata.is_dir();
                let file_metadata = FileMetadata {
                    name: path
                        .file_name()
                        .unwrap_or_else(|| std::ffi::OsStr::new("Invalid Unicode in path"))
                        .to_str()
                        .unwrap_or_else(|| "Invalid Unicode in path")
                        .to_string(),
                    size: metadata.len(),
                    is_dir: file_type,
                };
                dir_contents.push(file_metadata);
            }
            Err(e) => {
                return Err(e.to_string());
            }
        }
    }

    let json = json!(dir_contents);
    let json_str = json.to_string();
    Ok(json_str)
}