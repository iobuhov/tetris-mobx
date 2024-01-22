import React from "react";
import { createRoot } from "react-dom/client";
import { GameView } from "./v2/GameView";
import "./game/game.style.css";

const root = createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <GameView />
    </React.StrictMode>
);
