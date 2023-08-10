use std::path::PathBuf;
use opener::open;

type Path = Vec<String>;

#[tauri::command]
pub fn open_file(cwd : Path, name : String) {
    let cwd = cwd.into_iter().collect::<PathBuf>().into_os_string().into_string().unwrap();
    let path = PathBuf::from(cwd + "\\" + &name);
    println!("Opening file: {:?}", path);
    open(path).unwrap();
}
