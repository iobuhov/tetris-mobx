import { computed, makeObservable, observable } from "mobx"
import { id } from "./utils";

export class UIPoint {
    x = 0
    y = 0
    id = id()
    compositeBox
    constructor(x, y, compositeBox) {
        this.x = x
        this.y = y
        this.compositeBox = compositeBox
        makeObservable(this, {
            id: observable,
            x: observable,
            y: observable,
            pos: computed,
            fill: computed,
            data: computed
        })
    }

    get pos() {
        return `${this.x}.${this.y}`;
    }

    get fill() {
        return this.compositeBox.fillMap.get(this.pos);
    }

    get data() {
        return {
            id: this.id,
            fill: this.fill,
        }
    }
}
