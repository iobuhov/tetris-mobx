import { action, computed, makeObservable, observable } from "mobx";

export class CompositeBox {
    boxes = []
    baseMap
    constructor(width, height) {
        makeObservable(this, {
            boxes: observable,
            fillMap: computed,
            addBox: action
        })
        this.baseMap = this.createBaseMap(width, height);
    }

    get fillMap() {
        return this.boxes.reduce((map, box) => {
            for (const [k, v] of box.fillMap.entries()) {
                if (map.has(k) && v !== undefined) {
                    map.set(k, v);
                }
            }

            return map;
        }, new Map(this.baseMap))
    }

    addBox(box) {
        this.boxes.push(box);
    }

    createBaseMap(width, height) {
        const map = new Map();
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                const key = `${x}.${y}`;
                map.set(key, undefined);
            }
        }
        return map;
    }
}
