import { Box } from "../canvas/Box";
import { RXPoint } from "../canvas/RXPoint";

export class Field {
    box;
    constructor(width, height) {
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
}
