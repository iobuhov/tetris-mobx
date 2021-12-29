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

const gameTick = createEvent();

const moveLeft = createEvent();
const moveRight = createEvent();

const rotateLeft = createEvent();
const rotateRight = createEvent();

const $game = createStore(createGame());

$game.on(gameTick, (state) => {
  const nextState = updateGameElement(state, flowGameElement);

  return updateGameCanvas(nextState);
});

$game.on(moveLeft, (state) => {
  const nextState = updateGameElement(state, leftGameElement);

  return updateGameCanvas(nextState);
});

$game.on(moveRight, (state) => {
  const nextState = updateGameElement(state, rightGameElement);

  return updateGameCanvas(nextState);
});

$game.on(rotateLeft, (state) => {
  // TODO: Add rotate posibility checck
  const nextState = updateGameElement(state, rotateGameElementLeft);

  return updateGameCanvas(nextState);
});

$game.on(rotateRight, (state) => {
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
    setInterval(gameTick, 1000);
  }, []);

  return (
    <div className="game">
      <div className="game-area">
        {game.canvas.flat().map((color, rowIndex) => {
          return <div className={cn("area-cell", color)} key={rowIndex}></div>;
        })}
      </div>
    </div>
  );
}
