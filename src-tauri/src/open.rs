use serde::{Deserialize, Serialize};
use serde_json::{json};
use std::fs;
use std::path::PathBuf;
use opener::open;

#[tauri::command]
pub fn open_file(cwd : String, name : String) {
    let path = PathBuf::from(cwd + "\\" + &name);
    open(path).unwrap();
}
