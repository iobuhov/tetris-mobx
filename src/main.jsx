import React from "react";
import { createRoot } from "react-dom/client";
import { Sandbox } from "./game/sandbox";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Sandbox />
  </React.StrictMode>
);
