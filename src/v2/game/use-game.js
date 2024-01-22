import { useMemo } from "react";
import { Box } from "../canvas/Box";
import { Canvas } from "../canvas/Canvas";
import { CompositeBox } from "../canvas/CompositeBox";
import { RXPoint } from "../canvas/RXPoint";
import { Game } from "./Game";
import * as shapes from "./shapes";

export function useGame() {
    const game = useMemo(createGame, []);
    window.__game = game;
    return game;
}

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