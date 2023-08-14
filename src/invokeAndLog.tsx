import { invoke } from "@tauri-apps/api/tauri";

export async function invokeAndLog(name : string, args : {}) {
    return await invoke(name, args);
}