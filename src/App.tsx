import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import "./styles/App.scss";
import { Dir } from "./Dir";

function App() {
  const [cwd, setCwd] = useState("");

  useEffect(() => {
    async function walkCwd() {
        let cwd : string = await invoke("get_cwd");
        console.log(cwd);
        setCwd(cwd);
    }
    walkCwd();
  }, []);

  return (
    <div className="container">
      <h1>RS Explore</h1>
      <Dir cwd={cwd} setCwd={setCwd} />
    </div>
  );
}

export default App;