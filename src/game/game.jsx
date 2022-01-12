import { useEffect } from "react";
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
  checkFieldAndElementIntersection,
  isElementOutOfFieldByX,
  startNewElement, isElementReachBottom,
  removeGameLines,
} from "../modules/game/game";

const startNewGame = createEvent();
const gameTick = createEvent();
const moveLeft = createEvent();
const moveRight = createEvent();
const rotateLeft = createEvent();
const rotateRight = createEvent();

function gameUpdate(state) {
  if (isElementOutOfFieldByX(state.area, flowGameElement(state.activeElement))) {
    return state;
  }

  if (isElementReachBottom(state.area, state.activeElement) || checkFieldAndElementIntersection(state.area, flowGameElement(state.activeElement))) {
    return removeGameLines(startNewElement(state));
  }

  const nextState = updateGameElement(state, flowGameElement);

  return updateGameCanvas(nextState);
}

/**
 * @param {Function} reducer
 * @returns {(game: Game) => Game}
 */
export function withRotateChecks(reducer) {
  return (game) => {
    const futureElement = reducer(game.activeElement);
    if (checkFieldAndElementIntersection(game.area, futureElement) || isElementReachBottom(game.area, futureElement)) {
      return game;
    }

    if (isElementOutOfFieldByX(game.area, futureElement)) {
      return game;
    }

    const updatedGame = updateGameElement(game, reducer);

    return updateGameCanvas(updatedGame);
  };
}

/**
 * @param {Function} reducer
 * @returns {(game: Game) => Game}
 */
export function withMoveChecks(reducer) {
  return (game) => {
    const futureElement = reducer(game.activeElement);
    if (checkFieldAndElementIntersection(game.area, futureElement)) {
      return game;
    }

    if (isElementOutOfFieldByX(game.area, futureElement)) {
      return game;
    }

    const updatedGame = updateGameElement(game, reducer);

    return updateGameCanvas(updatedGame);
  };
}


const $game = createStore(createGame())
  .on(startNewGame, createGame)
  .on(gameTick, gameUpdate)
  .on(moveLeft, withMoveChecks(leftGameElement))
  .on(moveRight, withMoveChecks(rightGameElement))
  .on(rotateLeft, withRotateChecks(rotateGameElementLeft))
  .on(rotateRight, withRotateChecks(rotateGameElementRight));

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

      <div tabIndex="0" className="game-area">
        {game.canvas.flat().map((color, rowIndex) => {
          return <div className={cn("area-cell", color, color && "element")} key={rowIndex} />;
        })}
      </div>
      <div className="game-stats">
        <button onClick={() => {
          document.querySelector('.game-area').focus();
          startNewGame();
        }}>Start New Game</button>
      </div>
    </div>
  );
}
