import { useState, useEffect, useRef } from "react";
import { Bar } from "./Bar";

import "./styles/dir.scss";
import { invoke } from "@tauri-apps/api";

type Path = string[];

interface DirProps {
    cwd: Path;
    setCwd: React.Dispatch<React.SetStateAction<Path>>;
}

export interface ItemInDir {
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

interface RowProps {
    file: ItemInDir;
    cwd: Path;
    setCwd: React.Dispatch<React.SetStateAction<Path>>;
    selected: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const Row: React.FC<RowProps> = ({ file, cwd, setCwd, selected, setSelected }) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    function getRowInner() {
        function switchFolder() {
            let temp_cwd = [...cwd];
            temp_cwd.push(file.name);
            console.log("switching : ", temp_cwd);
            setCwd(temp_cwd)
        }

        function openFile() {
            console.log("opening file : ", file.name);
            invoke("open_file", { cwd, name: file.name });
        }

        if (!file.is_dir) {
            return (file.name != selected ?
                <li className="item" key={file.name} onClick={() => setSelected(file.name)} >
                    <p id="name">{file.name}</p>
                    <p id="size">{bytesToReadable(file.size)}</p>
                </li> :
                <li className="item selected" key={file.name} onDoubleClick={openFile}>
                    <p id="name">{file.name}</p>
                    <p id="size">{bytesToReadable(file.size)}</p>
                </li>
            );
        } else {
            return file.name != selected ?
                <li className="item" key={file.name} onClick={() => { setSelected(file.name) }} onDoubleClick={switchFolder}>
                    <p id="name">{file.name}</p>
                </li> :
                <li className="item selected" key={file.name} onDoubleClick={switchFolder}>
                    <p id="name">{file.name}</p>
                </li>
        }
    }

    function handleClickOutside(event: MouseEvent) {
        if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
            setSelected("");
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return <div ref={nodeRef}>{getRowInner()}</div>;
}

export const Dir: React.FC<DirProps> = ({ cwd, setCwd }) => {
    const [dir, setDir] = useState<ItemInDir[]>([]); // [name, size, is_dir]
    const [selected, setSelected] = useState("");

    useEffect(() => {
        async function walkCwd() {
            setDir(JSON.parse(await invoke("get_dir_contents", { dir: cwd })));
        }
        walkCwd();
    });

    const files = dir.filter(item => !item.is_dir);
    const dirs = dir.filter(item => item.is_dir);

    const dirElements = dirs.map(item => <Row file={item} cwd={cwd} setCwd={setCwd} selected={selected} setSelected={setSelected} />);
    const fileElements = files.map(item => <Row file={item} cwd={cwd} setCwd={setCwd} selected={selected} setSelected={setSelected} />);

    return (
        <div className="dir">
            <div id="itemList">
                <Bar {...{ cwd, setCwd, dir, setDir }} />
                <ul id="dirs">{dirElements}</ul>
                <ul id="files">{fileElements}</ul>
            </div>
        </div>
    );
};