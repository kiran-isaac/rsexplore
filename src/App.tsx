import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");

  console.log("App component mounted"); // Add this line

  useEffect(() => {
    async function fetchGreetMsg() {
      const response : string = await invoke("test", { name: "World" });
      setGreetMsg(response);
    }
    fetchGreetMsg();
  }, []);

  return (
    <div className="container">
      <h1>RS Explore</h1>
      <p>{greetMsg}</p>
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
