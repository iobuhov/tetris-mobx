import { useState, useEffect, useReducer } from "react";
import cn from "classnames";
import { createStore, createEvent } from "effector";
import { useStore } from "effector-react";

import "./game.style.css";

const AREA_COLUMNS = 12;
const AREA_ROWS = 21;
// const AREA_COLUMNS = 6;
// const AREA_ROWS = 6;
const AREA = AREA_COLUMNS * AREA_ROWS;
const COLOR_CLASSES = {
  cyan: "cyan",
  blue: "blue",
  orange: "orange",
  yellow: "yellow",
  green: "green",
  pink: "pink",
  red: "red",
};

const ELEMENT_TYPES = {
  I: "I",
  J: "J",
  L: "L",
  O: "O",
  S: "S",
  T: "T",
  Z: "Z",
};

/**
 *
 * @param {number[][]} matrix
 * @returns {number[][]}
 */
function rotateMatrixLeft(matrix) {
  // TODO: сделать функцию которая обновлет элемент with, haidht, shape

  const result = [];
  let rowLen = matrix.length;
  let colLen = matrix[0].length;

  for (let col = 0; col < colLen; col++) {
    let nextRow = [];

    for (let row = rowLen - 1; row >= 0; row--) {
      nextRow.push(matrix[row][col]);
    }

    result.push(nextRow);
  }

  return result;
}

const POSITION_0 = {
  [ELEMENT_TYPES.J]: [
    [1, 0, 0],
    [1, 1, 1],
  ],
};

const POSITION_1 = {
  [ELEMENT_TYPES.J]: [
    [1, 1],
    [1, 0],
    [1, 0],
  ],
};

const POSITION_2 = {
  [ELEMENT_TYPES.J]: [
    [1, 1, 1],
    [0, 0, 1],
  ],
};

const POSITION_3 = {
  [ELEMENT_TYPES.J]: {
    width: 2,
    height: 3,
    sprite: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  },
};

const gameTick = createEvent();

const moveLeft = createEvent();
const moveRight = createEvent();

const rotateLeft = createEvent();
const rotateRight = createEvent();

const $game = createStore({
  area: Array.from(Array(AREA_ROWS)).map(() => {
    return Array.from(Array(AREA_COLUMNS)).map(() => 0);
  }),
  activeElement: {
    ...POSITION_3[ELEMENT_TYPES.J],
    type: ELEMENT_TYPES.J,
    color: COLOR_CLASSES.red,
    x: 5,
    y: 0,
  },
  canvas: Array.from(Array(AREA_ROWS)).map(() => {
    return Array.from(Array(AREA_COLUMNS)).map(() => 0);
  }),
});

function comitState(state) {
  const canvas = merge(state.area, state.activeElement);

  return { ...state, canvas };
}

function flowElement(activeElement) {
  const { y } = activeElement;

  return {
    ...activeElement,
    y: y < AREA_ROWS ? y + 1 : y,
  };
}

function leftElement(activeElement) {
  const { x } = activeElement;

  return {
    ...activeElement,
    x: x > 0 ? x - 1 : x,
  };
}

function rightElement(activeElement) {
  const { x, width } = activeElement;

  return {
    ...activeElement,
    x: x + width < AREA_COLUMNS ? x + 1 : x,
  };
}

function updateElement(state, reducer) {
  return {
    ...state,
    activeElement: reducer(state.activeElement),
  };
}

$game.on(gameTick, (state) => {
  const nextState = updateElement(state, flowElement);

  return comitState(nextState);
});

$game.on(moveLeft, (state) => {
  const nextState = updateElement(state, leftElement);

  return comitState(nextState);
});

$game.on(moveRight, (state) => {
  const nextState = updateElement(state, rightElement);

  return comitState(nextState);
});

$game.on(rotateLeft, (state) => {
  return state;
});

$game.on(rotateRight, (state) => {
  return state;
});

function merge(area, element) {
  const result = [];

  element.sprite.forEach((row, indexY) => {
    row.forEach((value, indexX) => {
      if (value === 0) {
        return;
      }

      result.push([element.x + indexX, element.y + indexY]);
    });
  });

  const areaCopy = area.map((row) => [...row]);

  return result.reduce((acc, [x, y]) => {
    acc[y][x] = element.color;

    return acc;
  }, areaCopy);
}

// const area1 = [
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
// ];

// const element1 = {
//   type: ELEMENT_TYPES.J,
//   sprite: POSITION_0.J,
//   color: COLOR_CLASSES.red,
//   x: 1,
//   y: 1,
// };

// const expectedArea = [
//   [0, 0, 0, 0, 0, 0],
//   [0, 1, 0, 0, 0, 0],
//   [0, 1, 1, 1, 0, 0],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
// ];

/**
 *
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  if (event.key === "ArrowLeft") {
    return moveLeft();
  }

  if (event.key === "ArrowRight") {
    return moveRight();
  }

  if (event.key === "ArrowDown") {
    return gameTick();
  }
}

function useControls() {
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
  });
}

export function Game() {
  // console.log("render");
  // const r1 = JSON.stringify(merge(area1, element1));
  // const r2 = JSON.stringify(expectedArea);
  // console.log("🚀 ~ Game ~ r1 === r2", r1 === r2);

  const game = useStore($game);

  useControls();

  useEffect(() => {
    setInterval(gameTick, 1000);
  }, []);

  return (
    <div className="game">
      <div className="game-area">
        {/* {console.log(
          "🚀 ~ {game.canvas.flat ~ game.canvas.flat()",
          game.canvas.flat()
        )} */}
        {game.canvas.flat().map((color, rowIndex) => {
          // console.log("🚀 ~ {game.canvas.flat ~ color", color);

          return <div className={cn("area-cell", color)} key={rowIndex}></div>;
        })}
      </div>
    </div>
  );
}
