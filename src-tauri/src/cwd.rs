use serde::{Deserialize, Serialize};
use serde_json::json;
use std::fs;
use std::path::PathBuf;
use windows::Win32::Storage::FileSystem::GetLogicalDrives;

#[derive(Serialize, Deserialize)]
struct FileMetadata {
    name: String,
    size: u64,
    is_dir: bool,
}

type Path = Vec<String>;

#[tauri::command]
pub fn get_cwd() -> Result<Path, String> {
    // // get the current working directory as a Path
    // let path : Path = std::env::current_dir().map_err(|e| e.to_string())?
    //     .to_str()
    //     .unwrap_or_else(|| "Invalid Unicode in path")
    //     .to_string()
    //     .split(std::path::MAIN_SEPARATOR)
    //     .map(|s| s.to_string()).collect();

    // // add a leading slash
    // let mut cwd_mut : Path = vec![std::path::MAIN_SEPARATOR.to_string()];
    // cwd_mut.extend(path);

    // Ok(cwd_mut)

    Ok(vec!["/".to_string(), "C:/".to_string()])
}

unsafe fn get_drive_letters() -> Vec<String> {
    let drives = GetLogicalDrives();
    let mut result = Vec::new();
    for i in 0..26 {
        if (drives >> i) & 1 == 1 {
            let drive_letter = (b'A' + i as u8) as char;
            result.push(drive_letter.to_string() + ":/");
        }
    }
    result
}

#[tauri::command]
pub fn get_dir_contents(mut dir: Path) -> Result<String, String> {    
    let drive_mode = dir.len() == 1;

    if dir.len() == 0 {
        return Ok("".to_string())
    }

    dir.remove(0);

    let dir = dir.join(&std::path::MAIN_SEPARATOR.to_string()).to_string();


    let path = PathBuf::from(dir.clone());
    let mut dir_contents: Vec<FileMetadata> = Vec::new();

    if drive_mode {
        // If dir is empty, use the drives
        let drives = unsafe { get_drive_letters() };

        for drive in drives {
            let file_metadata = FileMetadata {
                name: drive,
                size: 0,
                is_dir: true,
            };
            dir_contents.push(file_metadata);
        }
    } else {
        for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
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
    }

    let json = json!(dir_contents);
    let json_str = json.to_string();
    Ok(json_str)
}