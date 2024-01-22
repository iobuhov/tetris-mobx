import { makeAutoObservable } from "mobx"
import { id } from "./utils"

export class RXPoint {
    x = 0
    y = 0
    id = id()
    fill = undefined
    anchor = undefined

    constructor(x, y, options = {}) {
        makeAutoObservable(this);
        this.x = x;
        this.y = y;
        this.fill ??= options.fill;
        this.id ??= options.id;
        this.anchor ??= options.anchor;
    }

    get offsetX() {
        const { x, anchor = { x: 0 } } = this;
        return anchor.x + x;
    }

    get offsetY() {
        const { y, anchor = { y: 0 } } = this;
        return anchor.y + y;
    }

    get pos() {
        return `${this.offsetX}.${this.offsetY}`;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setFill(fill) {
        this.fill = fill;
    }
}