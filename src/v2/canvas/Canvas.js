import { computed, makeObservable } from "mobx";
import { UIPoint } from "./UIPoint";

export class Canvas {
    uiPoints
    constructor(width, height, compositeBox) {
        this.uiPoints = this.createUIPoints(width, height, compositeBox)
        makeObservable(this, {
            points: computed
        })
    }

    get points() {
        return this.uiPoints.map(({ data }) => data);
    }

    createUIPoints(width, height, compositeBox) {
        const uiPoints = []
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                uiPoints.push(new UIPoint(x, y, compositeBox))
            }
        }
        return uiPoints;
    }
}