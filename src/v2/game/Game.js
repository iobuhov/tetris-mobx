import { action, autorun, makeObservable, observable } from "mobx";
import { Box } from "../canvas/Box";
import { RXPoint } from "../canvas/RXPoint";

export class Game {
    paused = false;
    initialSpeed = 750;
    gameSpeed = this.initialSpeed;
    shape;
    shapeViewBox;
    constructor(canvas, compositeBox, field, factory) {
        this.canvas = canvas;
        this.compositeBox = compositeBox;
        this.field = field;
        this.shapeFactory = factory;

        makeObservable(this, {
            paused: observable,
            gameSpeed: observable,
            togglePause: action,
            reset: action,
        });
    }

    reset() {
        this.paused = false;
        this.gameSpeed = this.initialSpeed;
        this.shape = undefined;
        this.compositeBox.reset();
        this.field.reset();
        this.compositeBox.addBox(this.field.box);
        this.startGameTimer();
    }

    togglePause() {
        this.paused = !this.paused;
    }

    tick() {
        if (!this.shape) {
            this.loadShape();
            return;
        }

        if (this.isShapeStuck) {
            this.endRound();
            return;
        } else {
            this.moveShapeDown();
        }
    }

    setupEffects() {
        const disposer = autorun(() => this.startGameTimer());
        return () => {
            disposer();
            if (this.stopTimer) {
                this.stopTimer();
            }
        };
    }

    startGameTimer() {
        const { paused, gameSpeed } = this;

        if (this.stopTimer) {
            this.stopTimer();
        }

        if (paused) {
            return;
        }

        const timerId = setInterval(this.scheduleTick, gameSpeed);
        this.stopTimer = () => clearInterval(timerId);
    }

    scheduleTick = () => {
        requestAnimationFrame(() => this.tick());
    };

    loadShape() {
        this.shape = this.shapeFactory(this.canvas.width);

        if (this.isFull) {
            this.shape.rotateClockwise();
        }

        if (this.isFull) {
            this.gameOver();
        } else {
            this.shapeViewBox = new Box(new RXPoint(0, 0));
            this.shapeViewBox.copy(this.shape.box);
            this.compositeBox.addBox(this.shapeViewBox);
        }
    }

    commitShape() {
        this.shapeViewBox.copy(this.shape.box);
    }

    endRound() {
        this.field.box.merge(this.shapeViewBox.points);
        this.field.prune();
        this.compositeBox.removeBox(this.shapeViewBox);
        this.loadShape();
    }

    gameOver() {
        console.log("game over");
        this.stopTimer();
    }

    get isFull() {
        return !this.field.box.isEmptyPoints(
            this.shape.mapPoints((p) => p.pos)
        );
    }

    get isShapeStuck() {
        return !this.canMoveShapeDown;
    }

    get canMoveShapeDown() {
        return this.field.box.isEmptyPoints(this.shape.getBottomKeys());
    }

    get canMoveShapeLeft() {
        return this.field.box.isEmptyPoints(this.shape.getLeftKeys());
    }

    get canMoveShapeRight() {
        return this.field.box.isEmptyPoints(this.shape.getRightKeys());
    }

    get canRotateShape() {
        return this.field.box.isEmptyPoints(this.shape.getRotateKeys("cw"));
    }

    get isPaused() {
        return this.paused;
    }

    moveShapeLeft() {
        if (!this.isPaused && this.canMoveShapeLeft) {
            this.shape.moveLeft();
            this.commitShape();
        }
    }

    moveShapeRight() {
        if (!this.isPaused && this.canMoveShapeRight) {
            this.shape.moveRight();
            this.commitShape();
        }
    }

    moveShapeDown() {
        if (!this.isPaused && this.canMoveShapeDown) {
            this.shape.moveDown();
            this.commitShape();
        }
    }

    rotateShape() {
        if (!this.isPaused && this.canRotateShape) {
            this.shape.rotateClockwise();
            this.commitShape();
        }
    }

    dropShape() {
        if (this.isPaused) {
            return;
        }

        while (this.canMoveShapeDown) {
            this.shape.moveDown();
        }
        this.commitShape();
        this.endRound();
    }
}
