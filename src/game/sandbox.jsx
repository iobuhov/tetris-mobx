import { useMemo } from "react"
import { GameVM } from "../modules/models/GameVM";
import "./game.style.css";

export function Sandbox() {
    const game = useMemo(() => new GameVM(), []);
    window.__game = game;

    return (
        <div className="game">
            <div tabIndex="0" className="game-area">
                {game.cells.map(cell => <div key={cell.id} className="area-cell" />)}
            </div>
            <div className="game-stats"></div>
        </div>
    )
}