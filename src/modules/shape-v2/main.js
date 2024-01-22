import { Box } from "../models/Box";
import { RXPoint } from "../models/RXPoint";
import { Shape } from "./Shape";
import { getRandomColor } from "./utils";

export function shapeI(anchorX = 0, anchorY = 0) {
    return new Shape(new Box(new RXPoint(anchorX, anchorY)), {
        size: [1, 4],
        shapePoints: [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3]
        ],
    })
}

export function shapeJ(anchorX = 0, anchorY = 0) {
    return new Shape(new Box(new RXPoint(anchorX, anchorY)), {
        size: [2, 3],
        shapePoints: [
            [1, 0],
            [1, 1],
            [1, 2],
            [0, 2]
        ],
    })
}

export function shapeL(anchorX = 0, anchorY = 0) {
    return new Shape(new Box(new RXPoint(anchorX, anchorY)), {
        size: [2, 3],
        shapePoints: [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 2]
        ],
    })
}

export function shapeO(anchorX = 0, anchorY = 0) {
    return new Shape(new Box(new RXPoint(anchorX, anchorY)), {
        size: [2, 2],
        shapePoints: [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1]
        ],
    })
}

export function shapeS(anchorX = 0, anchorY = 0) {
    return new Shape(new Box(new RXPoint(anchorX, anchorY)), {
        size: [3, 2],
        shapePoints: [
            [1, 0],
            [2, 0],
            [0, 1],
            [1, 1]
        ],
    })
}

export function shapeT(anchorX = 0, anchorY = 0) {
    return new Shape(new Box(new RXPoint(anchorX, anchorY)), {
        size: [3, 2],
        shapePoints: [
            [1, 0],
            [0, 1],
            [1, 1],
            [2, 1]
        ],
    })
}

export function shapeZ(anchorX = 0, anchorY = 0) {
    return new Shape(new Box(new RXPoint(anchorX, anchorY)), {
        size: [3, 2],
        shapePoints: [
            [0, 0],
            [1, 0],
            [1, 1],
            [2, 1]
        ],
    })
}
