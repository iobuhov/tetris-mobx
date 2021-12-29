import { AREA_COLUMNS, AREA_ROWS } from "../../game.config";
import {
  getShapeSize,
  getRandomShape,
  rotateShapeRight,
  rotateShapeLeft,
} from "../shape/shape";
import { COLOR_CLASSES } from "./game-element.const";

/**
 * @typedef {import('../shape/shape.js').Shape} Shape
 */

/**
 * @typedef {Object} GameElement
 * @property {number} width
 * @property {number} height
 * @property {Shape} shape
 * @property {number} x
 * @property {number} y
 * @property {string} color
 */

/**
 * @returns {Shape}
 */
export function getRandomColor() {
  const list = Object.values(COLOR_CLASSES);
  const randomListIndex = Math.floor(Math.random() * list.length);

  return JSON.parse(JSON.stringify(list[randomListIndex]));
}

/**
 * @param {Shape} shape
 * @returns {GameElement}
 */
export function creteGameElement(shape) {
  return {
    ...getShapeSize(shape),
    color: getRandomColor(),
    shape: JSON.parse(JSON.stringify(shape)),
    x: 5,
    y: 0,
  };
}

export function getRandomGameElement() {
  return creteGameElement(getRandomShape());
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function flowGameElement(gameElement) {
  const { y } = gameElement;

  return {
    ...gameElement,
    y: y < AREA_ROWS ? y + 1 : y,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function leftGameElement(gameElement) {
  const { x } = gameElement;

  return {
    ...gameElement,
    x: x > 0 ? x - 1 : x,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function rightGameElement(gameElement) {
  const { x, width } = gameElement;

  return {
    ...gameElement,
    x: x + width < AREA_COLUMNS ? x + 1 : x,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function rotateGameElementRight(gameElement) {
  const shape = rotateShapeRight(gameElement.shape);

  return {
    ...gameElement,
    ...getShapeSize(shape),
    shape,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function rotateGameElementLeft(gameElement) {
  const shape = rotateShapeLeft(gameElement.shape);

  return {
    ...gameElement,
    ...getShapeSize(shape),
    shape,
  };
}
