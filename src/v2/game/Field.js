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

    prune() {
        let points = 0;
        runInAction(() => {
            const fillRect = this.pointsRect().map(row => row.map(p => p.fill))
            const filteredRect = [];
            fillRect.forEach(row => {
                const isFull = row.every(fill => fill !== undefined)
                if (isFull) {
                    points += 1;
                } else {
                    filteredRect.push(row)
                }
            })
            this.box.clear();
            this.writeFillRect(filteredRect);
        })
        return points;
    }
}
