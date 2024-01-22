import { Box } from "../canvas/Box";
import { RXPoint } from "../canvas/RXPoint";
import { Shape } from "../canvas/Shape";
import { getRandomColor } from "./utils";

function createShape(params, options = {}) {
    const fill = options.fill ?? getRandomColor();
    const anchor = new RXPoint(...params.anchor);
    const box = new Box(anchor);
    const points = params.points.map(([x, y]) => new RXPoint(x, y, { fill }))
    box.setPoints(points);
    return new Shape(box, params.size);
}

export function shapeI(anchorX = 0, anchorY = 0) {
    return createShape({
        anchor: [anchorX, anchorY],
        size: [1, 4],
        points: [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3]
        ],
    })
}

export function shapeJ(anchorX = 0, anchorY = 0) {
    return createShape({
        anchor: [anchorX, anchorY],
        size: [2, 3],
        points: [
            [1, 0],
            [1, 1],
            [1, 2],
            [0, 2]
        ],
    })
}

export function shapeL(anchorX = 0, anchorY = 0) {
    return createShape({
        anchor: [anchorX, anchorY],
        size: [2, 3],
        points: [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 2]
        ],
    })
}

export function shapeO(anchorX = 0, anchorY = 0) {
    return createShape({
        anchor: [anchorX, anchorY],
        size: [2, 2],
        points: [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1]
        ],
    })
}

export function shapeS(anchorX = 0, anchorY = 0) {
    return createShape({
        anchor: [anchorX, anchorY],
        size: [3, 2],
        points: [
            [1, 0],
            [2, 0],
            [0, 1],
            [1, 1]
        ],
    })
}

export function shapeT(anchorX = 0, anchorY = 0) {
    return createShape({
        anchor: [anchorX, anchorY],
        size: [3, 2],
        points: [
            [1, 0],
            [0, 1],
            [1, 1],
            [2, 1]
        ],
    })
}

export function shapeZ(anchorX = 0, anchorY = 0) {
    return createShape({
        anchor: [anchorX, anchorY],
        size: [3, 2],
        points: [
            [0, 0],
            [1, 0],
            [1, 1],
            [2, 1]
        ],
    })
}
