import { useMemo, useEffect } from "react";
import { Box } from "../canvas/Box";
import { Canvas } from "../canvas/Canvas";
import { CompositeBox } from "../canvas/CompositeBox";
import { RXPoint } from "../canvas/RXPoint";
import { Game } from "./Game";
import * as shapes from "./shapes";
import { Field } from "./Field";
import { shapeFactory } from "./shape-factory";

export function useGame() {
    const game = useMemo(createGame, []);

    useEffect(() => game.setupEffects(), []);

    useEffect(() => {
        /**
         *
         * @param {KeyboardEvent} event
         */
        function handleKeyDown(event) {
            if (event.code === "ArrowDown") {
                game.startBoost(() => game.moveShapeDown(), 0)
                // game.moveShapeDown();
                return;
            }

            if (event.code === "ArrowLeft") {
                game.startBoost(() => game.moveShapeLeft(), 4);
                // game.moveShapeLeft()
                return;
            }

            if (event.code === "ArrowRight") {
                game.startBoost(() => game.moveShapeRight(), 4);
                // game.moveShapeRight()
                return ;
            }

            if (event.code === "ArrowUp") {
                return game.rotateShape();
            }

            if (event.code === "Escape") {
                return game.togglePause();
            }
        }

        /**
         *
         * @param {KeyboardEvent} event
         */
        function handleKeyUp(event) {
            if (event.code === "Space") {
                game.dropShape();
            }

            game.stopBoost()
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);
    window.__game = game;
    return game;
}

function createGame() {
    const width = 16;
    const height = 32;
    const compositeBox = new CompositeBox(width, height);
    const field = new Field(width, height);
    const canvas = new Canvas(width, height, compositeBox);
    const game = new Game(canvas, compositeBox, field, shapeFactory);

    compositeBox.addBox(field.box);

    return game;
}
