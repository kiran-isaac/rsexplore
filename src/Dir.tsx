import { useState, useEffect, useRef } from "react";
import { Bar } from "./Bar";

import "./styles/dir.scss";
import { invoke } from "@tauri-apps/api";
import React from "react";

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
    setCwd: (newCwd: Path) => void;
    selected: string;
    setSelected: (newSelected: string) => void;
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

type DirState = {
    dir: ItemInDir[];
    selected: string;
}

export class Dir extends React.Component<DirProps, DirState> {
    props: DirProps;

    constructor(props: DirProps) {
        super(props);
        this.props = props;
        this.state = { dir: [], selected: "" };
        this.getDirContents();
    }

    async getDirContents() {
        this.setState({dir : JSON.parse(await invoke("get_dir_contents", { dir: this.props.cwd }))});
    }

    render() {
        const files = this.state.dir.filter(item => !item.is_dir);
        const dirs = this.state.dir.filter(item => item.is_dir);

        const dirElements = dirs.map(item => <Row file={item} cwd={this.props.cwd} setCwd={this.props.setCwd} selected={this.state.selected} setSelected={(newSelected: string) => { this.setState({ selected: newSelected }); }} />);
        const fileElements = files.map(item => <Row file={item} cwd={this.props.cwd} setCwd={this.props.setCwd} selected={this.state.selected} setSelected={(newSelected: string) => { this.setState({ selected: newSelected }); }} />);

        return (
            <div className="dir">
                <div id="itemList">
                    <Bar cwd={this.props.cwd} setCwd={this.props.setCwd} dir={this.state.dir} setDir={(newDir) => { this.setState({ dir: newDir }) }} />
                    <ul id="dirs">{dirElements}</ul>
                    <ul id="files">{fileElements}</ul>
                </div>
            </div>
        );
    }
}