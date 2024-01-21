import React from "react";
import { createRoot } from "react-dom/client";
import { Game } from "./game/game";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);
