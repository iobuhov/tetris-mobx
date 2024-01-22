import { action, makeObservable } from "mobx";
import { RXPoint } from "../models/RXPoint"
import { getRandomColor } from "./utils";

export class Shape {
    size = [0, 0]
    box
    fill = getRandomColor()
    constructor(box, { shapePoints, size }) {
        this.size = size;
        this.box = box;
        this.box.setPoints(
            shapePoints.map(([x, y]) => new RXPoint(x, y, { fill: this.fill }))
        );

        makeObservable(this, {
            rotateClockwise: action,
            rotateAnticlockwise: action,
            moveLeft: action,
            moveRight: action,
            moveDown: action
        })
    }

    get width() {
        return this.size.at(0);
    }

    get height() {
        return this.size.at(1);
    }

    rotateClockwise() {
        const yMax = this.height - 1;
        this.box.points.forEach(p => {
            const { x, y } = p;
            p.setX(yMax - y);
            p.setY(x);
        });
        this.size.reverse();
    }

    rotateAnticlockwise() {
        const xMax = this.width - 1;
        this.box.points.forEach(p => {
            const { x, y } = p;
            p.setX(y);
            p.setY(xMax - x);
        });
        this.size.reverse();
    }

    moveLeft(n = 1) {
        this.box.anchor.x += n;
    }

    moveRight(n = 1) {
        this.box.anchor.x -= n;
    }

    moveDown(n = 1) {
        this.box.anchor.y += n;
    }
}
