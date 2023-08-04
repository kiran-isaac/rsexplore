import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Bar } from "./Bar";

import "./styles/Dir.scss";

interface DirProps {
    cwd: string;
    setCwd: React.Dispatch<React.SetStateAction<string>>;
}

interface File {
    name: string;
    size: number;
    is_dir: boolean;
}

function bytesToReadable(bytes: number): string {
    if (bytes < 1024) {
        return bytes + " B";
    } else if (bytes < 1048576) {
        return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1073741824) {
        return (bytes / 1048576).toFixed(2) + " MB";
    } else {
        return (bytes / 1073741824).toFixed(2) + " GB";
    }
}

export const Dir: React.FC<DirProps> = ({ cwd, setCwd }) => {
    const [dirDisplay, setDirDisplay] = useState(() => <div></div>);

    useEffect(() => {
        async function walkCwd() {
            const dir = JSON.parse(await invoke("get_dir_contents", { dir: cwd })) as File[];

            const files = dir.filter(item => !item.is_dir);
            const dirs = dir.filter(item => item.is_dir);
          
            const fileElements = files.map(item => <li key={item.name} onDoubleClick={() => invoke("open_file", {cwd: cwd, name:  item.name})}>
                    <p id="name">{item.name}</p>
                    <p id="size">{bytesToReadable(item.size)}</p>
                </li>);
            const dirElements = dirs.map(item => <li key={item.name} onDoubleClick={() => setCwd(cwd + "\\" + item.name)}>
                <p id="name">{item.name}</p>
                </li>);
          
            setDirDisplay(
              <div id="itemList">
                <ul id="dirs">{dirElements}</ul>
                <ul id="files">{fileElements}</ul>
              </div>
            );
        }
        walkCwd();
    });

    return (
        <div className="dir">
            <Bar cwd={cwd} setCwd={setCwd} />
            <div id="key">
                <h4>Name</h4>
                <h4>Size</h4>
            </div>
            <hr></hr>
            {dirDisplay}
        </div>
    );
};