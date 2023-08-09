import { useState, useEffect } from "react";

import "./styles/App.scss";
import { Dir } from "./Dir";
import { invoke } from "@tauri-apps/api";

type Path = string[];

async function getCwd() {
    return await invoke("get_cwd");
}

function App() {
    const [cwd, setCwd] = useState<Path>([]);

    useEffect(() => {
        async function fetchCwd() {
            setCwd(await getCwd() as Path);
        }
        fetchCwd();
    }, []);

    return (
        <div className="container">
            <Dir cwd={cwd} setCwd={setCwd} />
        </div>
    );
}

export default App;
