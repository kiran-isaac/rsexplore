import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const MyComponent: React.FC<MyComponentProps> = ({ name }) => {
  return <div>Hello, {name}!</div>;
};