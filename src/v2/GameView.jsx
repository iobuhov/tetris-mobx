import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useGame } from "./game/use-game";

const PointView = observer(
    ({ point }) =>
        <div
            key={Math.random()}
            className={cn("area-cell", { ["element"]: point.fill }, point.fill)}
        />
)

const GameArea = observer(({ canvas }) => (
    <div tabIndex="0" className="game-area">
        {canvas.points.map(point => <PointView key={point.id} point={point} />)}
    </div>
)
)

export function GameView() {
    const game = useGame()
    return (
        <div className="game">
            <GameArea canvas={game.canvas} />
            <div className="game-stats"></div>
        </div>
    )
}