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
 * @property {number} timestamp
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
    timestamp: Date.now(),
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
  const fieldCopy = JSON.parse(JSON.stringify(field));
  const elementCellsOnField = [];

  element.shape.forEach((row, indexY) => {
    row.forEach((value, indexX) => {
      if (value === 1) {
        elementCellsOnField.push([element.x + indexX, element.y + indexY]);
      }
    });
  });

  return elementCellsOnField.reduce((fieldResult, [x, y]) => {
    if (x >= 0 && y >= 0) {
      fieldResult[y][x] = element.color;
    }

    return fieldResult;
  }, fieldCopy);
}
