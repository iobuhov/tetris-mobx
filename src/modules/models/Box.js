import { action, computed, makeObservable, observable } from "mobx";

export class Box {
    points = []
    anchor
    constructor(anchor) {
        makeObservable(this, {
            points: observable,
            pointMap: computed,
            fillMap: computed,
            setPoints: action,
            merge: action
        })
        this.anchor = anchor
    }

    setPoints(points) {
        this.points = points.map(p => {
            p.anchor = this.anchor
            return p
        });
    }

    get pointMap() {
        return this.points.reduce((map, point) => {
            map.set(point.pos, point)
            return map
        }, new Map())
    }

    get fillMap() {
        return new Map(Array.from(this.pointMap, ([k, point]) => [k, point.fill]))
    }

    merge(points) {
        for (const p of points) {
            const target = this.pointMap.get(p.pos);
            if (target) {
                target.setFill(p.fill);
            }
        }
    }
}
