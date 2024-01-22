import cn from "classnames";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Box } from "../modules/models/Box";
import { CompositeBox } from "../modules/models/CompositeBox";
import { Game } from "../modules/models/Game";
import { RXPoint } from "../modules/models/RXPoint";
import "./game.style.css";
import { Renderer } from "../modules/models/Renderer";
import * as shapes from "../modules/shape-v2/main";

const PointView = observer(
    ({ point }) =>
        <div
            key={Math.random()}
            className={cn("area-cell", { ["element"]: point.fill }, point.fill)}
        />
)

const GameArea = observer(({ renderer }) => (
    <div tabIndex="0" className="game-area">
        {renderer.points.map(point => <PointView key={point.id} point={point} />)}
    </div>
))

function createGame() {
    const width = 12;
    const height = 21;
    const cbox = new CompositeBox(width, height);

    const box1 = new Box(new RXPoint(0, 0));
    box1.setPoints([new RXPoint(0, 0, { fill: "red" }), new RXPoint(0, 1, { fill: "red" })])

    // const box2 = new Box(new RXPoint(1, 0));
    // box2.setPoints([new RXPoint(0, 0, { fill: "blue" })])

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

    const renderer = new Renderer(width, height, cbox);
    const game = new Game(renderer);

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
            <GameArea renderer={game.renderer} />
            <div className="game-stats"></div>
        </div>
    )
}