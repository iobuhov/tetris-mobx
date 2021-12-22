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
  [ELEMENT_TYPES.J]: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
};

const gameTick = createEvent();

const $game = createStore({
  area: Array.from(Array(AREA_ROWS)).map(() => {
    return Array.from(Array(AREA_COLUMNS)).map(() => 0);
  }),
  activeElement: {
    type: ELEMENT_TYPES.J,
    sprite: POSITION_3.J,
    color: COLOR_CLASSES.red,
    x: 0,
    y: 0,
  },
  canvas: Array.from(Array(AREA_ROWS)).map(() => {
    return Array.from(Array(AREA_COLUMNS)).map(() => 0);
  }),
});

$game.on(gameTick, (state) => {
  if (state.activeElement.y < AREA_ROWS) {
    state.activeElement.y += 1;

    const a = merge(state.area, state.activeElement);
    console.log("🚀 ~ $game.on ~ a", a);

    state.canvas = merge(state.area, state.activeElement);
  }

  return { ...state };
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

export function Game() {
  console.log("render");
  // const r1 = JSON.stringify(merge(area1, element1));
  // const r2 = JSON.stringify(expectedArea);
  // console.log("🚀 ~ Game ~ r1 === r2", r1 === r2);

  const game = useStore($game);

  useEffect(() => {
    setInterval(gameTick, 1000);
  }, []);

  return (
    <div className="game">
      <div className="game-area">
        {console.log(
          "🚀 ~ {game.canvas.flat ~ game.canvas.flat()",
          game.canvas.flat()
        )}
        {game.canvas.flat().map((color, rowIndex) => {
          console.log("🚀 ~ {game.canvas.flat ~ color", color);

          return <div className={cn("area-cell", color)} key={rowIndex}></div>;
        })}
      </div>
    </div>
  );
}
