import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import "./App.css";

function App() {
  const [cwd, setCwd] = useState("");

  useEffect(() => {
    async function walkCwd() {
      invoke("walk_from", { drivePath : await invoke("get_cwd") });
    }
    walkCwd();
  }, []);

  return (
    <div className="container">
      <h1>RS Explore</h1>
      <p>{cwd}</p>
    </div>
  );
}

export default App;

/*
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }
*/
