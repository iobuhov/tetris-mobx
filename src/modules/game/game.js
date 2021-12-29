import { AREA_COLUMNS, AREA_ROWS } from "../../game.config";
import { getRandomGameElement } from "../game-element/game-element";

/**
 * @typedef {import('../game-element/game-element.js').GameElement} GameElement
 */

/**
 * @typedef {(string|0)[][]} GameField
 */

/**
 * @typedef {Object} Game
 * @property {GameField} area
 * @property {GameField} canvas
 * @property {GameElement} activeElement
 */

/**
 * @returns {GameField}
 */
function createGameField() {
  return Array.from(Array(AREA_ROWS)).map(() => {
    return Array.from(Array(AREA_COLUMNS)).map(() => 0);
  });
}

/**
 * @returns {Game}
 */
export function createGame() {
  return {
    area: createGameField(),
    canvas: createGameField(),
    activeElement: getRandomGameElement(),
  };
}

/**
 * @param {Game} game
 * @returns {Game}
 */
export function updateGameCanvas(game) {
  const canvas = merge(game.area, game.activeElement);

  return { ...game, canvas };
}

/**
 * @param {Game} game
 * @param {Function} reducer
 * @returns {Game}
 */
export function updateGameElement(game, reducer) {
  return {
    ...game,
    activeElement: reducer(game.activeElement),
  };
}

/**
 * @param {GameField} field
 * @param {GameElement} element
 * @returns {GameField}
 */
export function merge(field, element) {
  const result = [];

  element.shape.forEach((row, indexY) => {
    row.forEach((value, indexX) => {
      if (value === 0) {
        return;
      }

      result.push([element.x + indexX, element.y + indexY]);
    });
  });

  const areaCopy = field.map((row) => [...row]);

  return result.reduce((acc, [x, y]) => {
    acc[y][x] = element.color;

    return acc;
  }, areaCopy);
}
