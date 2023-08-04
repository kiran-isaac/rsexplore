import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import "./App.scss";
import { Dir } from "./Dir";

function App() {
  const [cwd, setCwd] = useState("");

  useEffect(() => {
    async function walkCwd() {
        setCwd(await invoke("get_cwd"));
    }
    walkCwd();
  }, []);

  return (
    <div className="container">
      <h1>RS Explore</h1>
      <Dir CWDName={cwd} />
    </div>
  );
}

export default App;