import { runInAction } from "mobx";
import { Box } from "../canvas/Box";
import { RXPoint } from "../canvas/RXPoint";

export class Field {
    box;
    constructor(width, height) {
        this.width = width
        this.height = height
        this.box = this.createFieldBox(width, height);
    }

    reset() {
        this.box.clear();
    }

    createFieldBox(width, height) {
        const box = new Box(new RXPoint(0, 0));
        const points = [];
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                points.push(new RXPoint(x, y));
            }
        }
        box.setPoints(points);
        return box;
    }

    pointsRect() {
        const rect = []
        for (let i = 0; i < this.height; i += 1) {
            const start = i * this.width;
            const row = this.box.points.slice(start, start + this.width);
            rect.push(row)
        }

        return rect;
    }

    writeFillRect(rect) {
        const flatRect = rect.flat();
        let boxIndex = this.box.points.length - 1,
            rectIndex = flatRect.length - 1;
        for (; rectIndex >= 0; boxIndex--, rectIndex--) {
            this.box.points[boxIndex].setFill(flatRect[rectIndex])
        }
    }

    // fillRand() {
    //     const list = [
    //         "cyan",
    //         "blue",
    //         "orange",
    //         "yellow",
    //         "green",
    //         "pink",
    //         "red",
    //         undefined,
    //     ];

    //     const fillRect = Array.from({ length: this.width * (this.height / 2) }, () => {
    //         return list[Math.floor(Math.random() * list.length)];
    //     })

    //     this.writeFillRect(fillRect);
    // }

    prune() {
        runInAction(() => {
            const fillRect = this.pointsRect().flatMap(row => {
                return row.every(p => p.fill) ? [] : row.map(p => p.fill)
            })
            this.box.clear();
            this.writeFillRect(fillRect);
        })
    }
}
