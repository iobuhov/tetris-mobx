import { useState, useEffect, useReducer } from "react";
import cn from "classnames";
import { createStore, createEvent } from "effector";
import { useStore } from "effector-react";

import "./game.style.css";

import {
  flowGameElement,
  leftGameElement,
  rightGameElement,
  rotateGameElementLeft,
  rotateGameElementRight,
} from "../modules/game-element/game-element";
import {
  createGame,
  updateGameCanvas,
  updateGameElement,
} from "../modules/game/game";

const startNewGame = createEvent();
const gameTick = createEvent();
const moveLeft = createEvent();
const moveRight = createEvent();
const rotateLeft = createEvent();
const rotateRight = createEvent();

const $game = createStore(createGame())
  .on(startNewGame, createGame)
  .on(gameTick, (state) => {
    const nextState = updateGameElement(state, flowGameElement);

    return updateGameCanvas(nextState);
  })
  .on(moveLeft, (state) => {
    const nextState = updateGameElement(state, leftGameElement);

    return updateGameCanvas(nextState);
  })
  .on(moveRight, (state) => {
    const nextState = updateGameElement(state, rightGameElement);

    return updateGameCanvas(nextState);
  })
  .on(rotateLeft, (state) => {
    // TODO: Add rotate posibility checck
    const nextState = updateGameElement(state, rotateGameElementLeft);

    return updateGameCanvas(nextState);
  })
  .on(rotateRight, (state) => {
    // TODO: Add rotate posibility checck
    const nextState = updateGameElement(state, rotateGameElementRight);

    return updateGameCanvas(nextState);
  });

/**
 *
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  if (event.key === " ") {
    return gameTick();
  }

  if (event.key === "ArrowLeft") {
    return moveLeft();
  }

  if (event.key === "ArrowRight") {
    return moveRight();
  }

  if (event.key === "ArrowUp") {
    return rotateRight();
  }

  if (event.key === "ArrowDown") {
    return rotateLeft();
  }
}

function useControls() {
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
}

export function Game() {
  const game = useStore($game);

  useControls();

  useEffect(() => {
    const id = setInterval(gameTick, 1000);

    return () => {
      clearInterval(id);
    };
  }, [game.timestamp]);

  return (
    <div className="game">
      <button onClick={startNewGame}>Start New Game</button>
      <div className="game-area">
        {game.canvas.flat().map((color, rowIndex) => {
          return <div className={cn("area-cell", color)} key={rowIndex}></div>;
        })}
      </div>
    </div>
  );
}
