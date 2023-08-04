import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

interface DirProps {
    CWDName: string;
}

interface File {
    name: string;
    is_dir: boolean;
}

export const Dir: React.FC<DirProps> = ({ CWDName: name }) => {
    const [dirContents, setDirContents] = useState<Array<File>>([]);

    useEffect(() => {
        async function walkCwd() {
            let dir = JSON.parse(await invoke("get_dir_contents", { dir: name }));
            setDirContents(dir);
        }
        walkCwd();
    });

    let dirList = [];

    for (let file of dirContents) {
        dirList.push(<li key={file.name}>{file.name}</li>);
    }

    return (
        <div className="dir">
            <h2>Directory Contents</h2>
            <ul>{dirList}</ul>
        </div>
    );
};