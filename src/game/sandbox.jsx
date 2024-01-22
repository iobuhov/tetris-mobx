import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Box } from "../v2/canvas/Box";
import { CompositeBox } from "../v2/canvas/CompositeBox";
import { Game } from "../v2/game/Game";
import { RXPoint } from "../v2/canvas/RXPoint";
import "./game.style.css";
import { Canvas } from "../v2/canvas/Canvas";
import * as shapes from "../v2/game/shapes";

const PointView = observer(
    ({ point }) =>
        <div
            key={Math.random()}
            className={cn("area-cell", { ["element"]: point.fill }, point.fill)}
        />
)

const GameArea = observer(({ renderer: canvas }) => (
    <div tabIndex="0" className="game-area">
        {canvas.points.map(point => <PointView key={point.id} point={point} />)}
    </div>
))

function createGame() {
    const width = 12;
    const height = 21;
    const cbox = new CompositeBox(width, height);

    const box1 = new Box(new RXPoint(0, 0));
    box1.setPoints([new RXPoint(0, 0, { fill: "red" }), new RXPoint(0, 1, { fill: "red" })])

    const shO = shapes.shapeO(3, 0);
    const shI = shapes.shapeI(0, 3);
    const shJ = shapes.shapeJ(2, 3);
    const shL = shapes.shapeL(5, 3);
    const shS = shapes.shapeS(8, 3);
    const shT = shapes.shapeT(0, 8);
    const shZ = shapes.shapeZ(4, 8);

    cbox.addBox(box1);
    cbox.addBox(shO.box);
    cbox.addBox(shI.box);
    cbox.addBox(shJ.box);
    cbox.addBox(shL.box);
    cbox.addBox(shS.box);
    cbox.addBox(shT.box);
    cbox.addBox(shZ.box);

    const canvas = new Canvas(width, height, cbox);
    const game = new Game(canvas);

    Object.assign(globalThis, {
        cbox,
        box1,
        shO,
        shI,
        shJ,
        shL,
        shS,
        shT,
        shZ,
        RXPoint
    })

    return game;
}

export function Sandbox() {
    const game = useMemo(createGame, []);
    window.__game = game;

    return (
        <div className="game">
            <GameArea renderer={game.canvas} />
            <div className="game-stats"></div>
        </div>
    )
}