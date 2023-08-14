import { useState, useEffect, useRef } from "react";
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
    } else if (bytes < 1099511627776) {
        return (bytes / 1073741824).toFixed(2) + " GB";
    } else {
        return (bytes / 1099511627776).toFixed(2) + " TB";
    }
}

interface RowProps {
    file : File;
    cwd : string;
    setCwd : React.Dispatch<React.SetStateAction<string>>;
    selected : string;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const Row: React.FC<RowProps> = ({ file, cwd, setCwd, selected, setSelected }) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    function getRowInner() {
        if (!file.is_dir) {
            return (file.name != selected ?
                <li className="item" key={file.name} onClick={() => setSelected(file.name)} onDoubleClick={() => invoke("open_file", {cwd, name : file.name})}>
                    <p id="name">{file.name}</p>
                    <p id="size">{bytesToReadable(file.size)}</p>
                </li> : 
                <li className="item selected" key={file.name}>
                    <p id="name">{file.name}</p>
                    <p id="size">{bytesToReadable(file.size)}</p>
                </li>
            );
        } else {
            return file.name != selected ? 
                    <li className="item" key={file.name} onClick={() => {setSelected(file.name)}} onDoubleClick={() => setCwd(cwd + "\\" + file.name)}>
                        <p id="name">{file.name}</p>
                    </li> :
                    <li className="item selected" key={file.name} onDoubleClick={() => setCwd(cwd + "\\" + file.name)}>
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
    const [dirDisplay, setDirDisplay] = useState(() => <div></div>);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        async function walkCwd() {
            const dir = JSON.parse(await invoke("get_dir_contents", { dir: cwd })) as File[];

            const files = dir.filter(item => !item.is_dir);
            const dirs = dir.filter(item => item.is_dir);

            const dirElements = dirs.map(item => <Row file={item} cwd={cwd} setCwd={setCwd} selected={selected} setSelected={setSelected}/>);
            const fileElements = files.map(item => <Row file={item} cwd={cwd} setCwd={setCwd} selected={selected} setSelected={setSelected}/>);

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