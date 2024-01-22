import { action, autorun, makeObservable, observable } from "mobx"
import { transformWithEsbuild } from "vite"

export class Game {
    paused = false
    gameSpeed = 1000
    constructor(canvas, compositeBox, field) {
        this.canvas = canvas
        this.compositeBox = compositeBox
        this.field = field

        makeObservable(this, {
            paused: observable,
            gameSpeed: observable,
            togglePause: action
        })
    }

    togglePause() {
        this.paused = !this.paused;
    }

    tick() {
        console.log("Game is on!");
    }

    setupEffects() {
        const disposer = autorun(() => this.startGameTimer())
        return () => {
            disposer()
            if (this.stopTimer) {
                this.stopTimer()
            }
        }
    }

    startGameTimer() {
        const { paused, gameSpeed } = this;

        if (this.stopTimer) {
            this.stopTimer()
        }

        if (paused) {
            return;
        }

        const timerId = setInterval(() => {
            requestAnimationFrame(() => this.tick())
        }, gameSpeed);

        this.stopTimer = () => clearInterval(timerId);
    }
}
