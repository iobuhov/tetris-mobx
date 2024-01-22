import * as shapes from "./shapes";

export function shapeFactory(width) {
    const keys = Object.keys(shapes);
    const shapeFn = keys[Math.floor(Math.random() * keys.length)];
    const shape = shapes[shapeFn](0, 0);

    if (width) {
        const anchorX = Math.floor((width - shape.width) / 2);
        shape.box.anchor.setX(anchorX);
    }

    return shape;
}
