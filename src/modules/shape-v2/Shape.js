import { action, makeObservable } from "mobx";

export class Shape {
    size
    box
    constructor(box, size = [0, 0]) {
        this.size = size;
        this.box = box;
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

    get points() {
        return this.box.points;
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
        this.box.anchor.x -= n;
    }

    moveRight(n = 1) {
        this.box.anchor.x += n;
    }

    moveDown(n = 1) {
        this.box.anchor.y += n;
    }
}
