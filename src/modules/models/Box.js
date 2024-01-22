import { action, computed, makeObservable, observable } from "mobx";
import { RXPoint } from "./RXPoint";

export class Box {
    points = []
    anchor
    constructor(anchor) {
        makeObservable(this, {
            points: observable,
            pointMap: computed,
            fillMap: computed,
            setPoints: action,
            merge: action,
            copy: action
        })
        this.anchor = anchor
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

    setPoints(points) {
        this.points = points.map(p => {
            p.anchor = this.anchor
            return p
        });
    }

    merge(points) {
        for (const p of points) {
            const target = this.pointMap.get(p.pos);
            if (target) {
                target.setFill(p.fill);
            }
        }
    }

    copy(box) {
        this.anchor.x = box.anchor.x;
        this.anchor.y = box.anchor.y;
        this.setPoints(box.points.map(p => new RXPoint(p.x, p.y, { fill: p.fill })))
    }
}
