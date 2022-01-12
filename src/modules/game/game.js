import { AREA_COLUMNS, AREA_ROWS } from "../../game.config";
import { getRandomGameElement, getElementCells } from "../game-element/game-element";

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


const defaultEmptyRow = Array.from(Array(AREA_COLUMNS)).map(() => 0);

function createEmptyRow() {
  return [...defaultEmptyRow];
}

/**
 * @returns {GameField}
 */
function createGameField() {
  return Array.from(Array(AREA_ROWS)).map(() => {
    return createEmptyRow();
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
  return {
    ...game,
    canvas: merge(game.area, game.activeElement)
  };
}

/**
 *
 * @param {Game} game
 * @returns {Game}
 */
export function startNewElement(game) {
  return {
    ...game,
    area: merge(game.area, game.activeElement),
    activeElement: getRandomGameElement(),
  };
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
 * @returns {Boolean}
 */
export function checkFieldAndElementIntersection(field, element) {
  return getElementCells(element).some(([x, y]) => {
    return !!(field[y] && field[y][x]);
  });
}

/**
 * @param {GameField} field
 * @param {GameElement} element
 * @returns {Boolean}
 */
export function isElementOutOfFieldByX(field, element) {
  const columns = field[0].length;

  return getElementCells(element).some(([x]) => {
    return x < 0 || x >= columns;
  })
}

/**
 * @param {GameField} field
 * @param {GameElement} element
 * @returns {boolean}
 */
export function isElementReachBottom(field, element) {
  return getElementCells(element).some(([, y]) => {
    return y === field.length - 1;
  })
}

/**
 * @param {(string|0)[]} row
 * @returns {(string|0)[]}
 */
function replaceFullRow(row) {
  return row.every(x => !!x) ? createEmptyRow() : row;
}

/**
 * Sort rows, put not empty at the bottom
 * @param {(string|0)[]} row1
 * @param {(string|0)[]} row2
 * @returns {number}
 */
function emptyFirst(row1, row2) {
  const isRow1Empty = row1.some(x => !!x);
  const isRow2Empty = row2.some(x => !!x);

  if (isRow1Empty && isRow2Empty) {
    return 0;
  }

  if (isRow1Empty && !isRow2Empty) {
    return 1;
  }

  if (isRow2Empty && !isRow1Empty) {
    return -1;
  }
}

/**
 * @param {Game} game
 * @returns {Game}
 */
export function removeGameLines(game) {
  return {
    ...game,
    area: game.area.map(replaceFullRow).sort(emptyFirst),
  }
}


/**
 * @param {GameField} field
 * @param {GameElement} element
 * @returns {GameField}
 */
export function merge(field, element) {
  const fieldCopy = JSON.parse(JSON.stringify(field));
  const elementCellsOnField = getElementCells(element);

  return elementCellsOnField.reduce((fieldResult, [x, y]) => {
    if (x >= 0 && y >= 0) {
      fieldResult[y][x] = element.color;
    }

    return fieldResult;
  }, fieldCopy);
}
