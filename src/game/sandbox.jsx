import { useMemo } from "react"
import { GameVM } from "../modules/models/GameVM";
import "./game.style.css";
import { observer } from "mobx-react-lite";
import cn from "classnames";

const PointView = observer(({ point }) => <div key={Math.random()} className={cn("area-cell", { ["element"]: point.fill }, point.fill)} />)

const GameArea = observer(({ renderer }) => (
    <div tabIndex="0" className="game-area">
        {renderer.points.map(point => <PointView key={point.id} point={point} />)}
    </div>
))

export function Sandbox() {
    const game = useMemo(() => new GameVM(), []);
    window.__game = game;

    return (
        <div className="game">
            <GameArea renderer={game.renderer} />
            <div className="game-stats"></div>
        </div>
    )
}