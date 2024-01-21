import { makeObservable, observable, computed, action, trace } from "mobx";
import * as mobx from "mobx";
Object.assign(globalThis, mobx);
const exp = {};

const id = () => Math.random().toString().slice(2, 10);

class Point {
    x = 0
    y = 0
    fill = null
    id = null

    constructor(x, y, id, fill) {
        mobx.makeAutoObservable(this);
        this.x = x;
        this.y = y;
        this.fill ??= fill;
        this.id ??= id;
    }

    get pos() {
        return `${this.x}.${this.y}`;
    }

    setFill(fill) {
        this.fill = fill;
    }
}

function createBox(width, height) {
    const points = [];
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            points.push(new Point(x, y, id()))
        }
    }

    return points;
}

class Sprite {
    anchor = null
    box = []
    height = 0
    width = 0

    constructor(w, h, anchor) {
        makeObservable(this, {
            anchor: observable,
            box: observable,
            boxMap: computed,
            computedBox: computed,
            hasAnchor: computed,
            merge: action

        })
        this.width = w;
        this.height = h;
        this.box = createBox(this.width, this.height);
        this.anchor ??= anchor;
    }

    get computedBox() {
        trace()
        return this.box.map(p => this.offsetPoint(p))
    }

    get boxMap() {
        return this.box.reduce((map, point) => {
            map.set(point.pos, point);
            return map;
        }, new Map())
    }

    get hasAnchor() {
        return this.anchor instanceof Point;
    }

    merge(box) {
        for (const point of box) {
            let target = this.boxMap.get(point.pos);
            if (target) {
                target.setFill(point.fill);
            }
        }
    }

    offsetPoint(point) {
        const { x, y, id, fill } = point;
        return new Point(
            this.hasAnchor ? this.anchor.x + x : x,
            this.hasAnchor ? this.anchor.y + y : y,
            id,
            fill
        )
    }
}

window.Sprite = Sprite;

class Canvas {
    box
    constructor(width, height) {
        this.box = createBox(width, height);
    }
    update(newBox) {
        if (this.box.length !== newBox.length) {
            console.warn("Can merge box only if it has same size");
            return;
        }

        this.box.forEach((point, index) => point.setFill(newBox[index].fill));
    }
}

class Renderer {
    width = 4
    height = 4
    sprites = []
    canvas = new Canvas(this.width, this.height)

    constructor() {
        makeObservable(this, {
            sprites: observable,
        })

        mobx.reaction(this.onSpriteChange, newBox => this.canvas.update(newBox))
    }

    onSpriteChange = () => {
        trace()
        const result = this.sprites.reduce((scene, sprite) => {
            scene.merge(sprite.computedBox);
            return scene;
        }, new Sprite(this.width, this.height));

        return [...result.computedBox]
    }

    get points() {
        return this.canvas.box;
    }

    addSprite(sprite) {
        this.sprites.push(sprite);
    }

    createCanvas() {
        return createBox(this.width, this.height);
    }
}

window.__bar = (fill, anchor) => {
    const s = new Sprite(3, 1, anchor);
    s.box[0].setFill(fill);
    s.box[1].setFill(fill);
    s.box[2].setFill(fill);
    return s;
}

export class GameVM {
    constructor() {
        this.renderer = new Renderer()
        let sp = __bar("blue", new Point(0, 0))
        let sx = __bar("green", new Point(0, 1))
        this.renderer.addSprite(sp);
        this.renderer.addSprite(sx);

        window.__sp = sp;
        window.__sx = sx;
    }
}
