import { Box } from "../canvas/Box";
import { RXPoint } from "../canvas/RXPoint";

export class Game {
    paused = false;
    initialDelay = 750;
    turnDelay = this.initialDelay;
    gameEnded = false;
    points = 0
    shape;
    shapeViewBox;
    constructor(canvas, compositeBox, field, factory) {
        this.canvas = canvas;
        this.compositeBox = compositeBox;
        this.field = field;
        this.shapeFactory = factory;
    }

    reset() {
        this.paused = false;
        this.turnDelay = this.initialDelay;
        this.gameEnded = false;
        this.shape = undefined;
        this.compositeBox.reset();
        this.field.reset();
        this.compositeBox.addBox(this.field.box);
        this.startTimer();
    }

    togglePause() {
        this.paused = !this.paused;
    }

    tick() {
        console.log("Game tick");
        if (this.isPaused) {
            return;
        }

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
        return this.startTimer();
    }

    startTimer() {
        if (this.stopTimer) {
            this.stopTimer();
        }

        this.scheduleTick();

        return () => this.stopTimer && this.stopTimer();
    }

    scheduleTick = () => {
        let timerId;
        let requestId = requestAnimationFrame(() => {
            this.tick();
            if (this.gameEnded) {
                return;
            }
            timerId = setTimeout(this.scheduleTick, this.turnDelay);
        });

        this.stopTimer = () => {
            clearTimeout(timerId);
            cancelAnimationFrame(requestId);
        }

        return this.stopTimer;
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
        let prevPoints = this.points;
        this.points += this.field.prune();
        if (this.points > prevPoints) {
            this.incGameSpeed();
        }
        this.compositeBox.removeBox(this.shapeViewBox);
        this.loadShape();
    }

    gameOver() {
        console.log("game over");
        this.gameEnded = true;
    }

    incGameSpeed() {
        if (this.turnDelay > 200) {
            this.turnDelay = Math.floor(this.turnDelay * 0.93)
            console.log(this.turnDelay);
            console.log(this.points);
        }
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

    get canRunAction() {
        return !this.gameEnded && !this.paused;
    }

    moveShapeLeft() {
        if (this.canRunAction && this.canMoveShapeLeft) {
            this.shape.moveLeft();
            this.commitShape();
        }
    }

    moveShapeRight() {
        if (this.canRunAction && this.canMoveShapeRight) {
            this.shape.moveRight();
            this.commitShape();
        }
    }

    moveShapeDown() {
        if (this.canRunAction && this.canMoveShapeDown) {
            this.shape.moveDown();
            this.commitShape();
        }
    }

    rotateShape() {
        if (this.canRunAction && this.canRotateShape) {
            this.shape.rotateClockwise();
            this.commitShape();
        }
    }

    dropShape() {
        if (!this.canRunAction) {
            return;
        }

        while (this.canMoveShapeDown) {
            this.shape.moveDown();
        }
        this.commitShape();
        this.endRound();
    }
}
