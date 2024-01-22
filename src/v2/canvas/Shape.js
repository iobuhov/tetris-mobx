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

    mapPoints(fn) {
        return this.box.points.map(fn);
    }

    mapPointsClockwise() {
        const yMax = this.height - 1;
        return this.mapPoints(p => ({ x: yMax - p.y, y: p.x }))
    }

    mapPointsAnticlockwise() {
        const xMax = this.width - 1;
        return this.mapPoints(p => ({ x: p.y, y: xMax - p.x }))
    }

    rotateClockwise() {
        this.mapPointsClockwise().forEach(({ x, y }, index) => {
            this.box.points[index].setX(x);
            this.box.points[index].setY(y);
        })
        this.size.reverse();
    }

    rotateAnticlockwise() {
        this.mapPointsAnticlockwise().forEach(({ x, y }, index) => {
            this.box.points[index].setX(x);
            this.box.points[index].setY(y);
        })
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

    getBottomKeys() {
        return this.mapPoints(p => `${p.offsetX}.${p.offsetY + 1}`)
    }

    getLeftKeys() {
        return this.mapPoints(p => `${p.offsetX - 1}.${p.offsetY}`)
    }

    getRightKeys() {
        return this.mapPoints(p => `${p.offsetX + 1}.${p.offsetY}`)
    }

    getRotateKeys(direction = "cw") {
        const pts = direction === "cw" ? this.mapPointsClockwise() : this.mapPointsAnticlockwise();
        return pts.map(({ x, y }) => `${this.box.anchor.x + x}.${this.box.anchor.y + y}`);
    }
}
