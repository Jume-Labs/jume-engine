import { Vec2 } from './vec2';

/**
 * Precision value.
 */
export const EPSILON = 0.0001;

/**
 * Lerp from one value to another.
 * @param start The start value.
 * @param end The end value.
 * @param position The position in between the values (0 - 1).
 * @returns The value at the position.
 */
export function lerp(start: number, end: number, position: number): number {
  return start + position * (end - start);
}

/**
 * Clamp a value between an upper and lower bound.
 * @param value The value to clamp.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    var temp = max;
    max = min;
    min = temp;
  }

  const lower = value < min ? min : value;

  return lower > max ? max : lower;
}

/**
 * Convert radians to degrees.
 * @param rad The radian value to convert.
 * @returns The converted value in degrees.
 */
export function toDeg(rad: number): number {
  return rad * (180.0 / Math.PI);
}

/**
 * Convert degrees to radians.
 * @param deg The degree value to convert.
 * @returns The converted value in radians.
 */
export function toRad(deg: number): number {
  return deg * (Math.PI / 180.0);
}

/**
 * Calculate the distance between two points.
 * @param x1 The x position of the first point.
 * @param y1 The y position of the first point.
 * @param x2 The x position of the second point.
 * @param y2 The y position of the second point.
 * @returns The distance.
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Compare two values that are almost equal.
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @param epsilon The precision to compare.
 * @returns True if the values are almost equal.
 */
export function fuzzyEqual(a: number, b: number, epsilon = 0.0001): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Rotate a point around another point.
 * @param x The x position of the point to rotate.
 * @param y The y position of the point to rotate.
 * @param centerX The x position of the center.
 * @param centerY The y position of the center.
 * @param angle The angle in degrees.
 * @returns The x and y of the rotated position.
 */
export function rotateAround(x: number, y: number, centerX: number, centerY: number, angle: number): [number, number] {
  const rad = toRad(-angle);
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  const tx = x - centerX;
  const ty = y - centerY;

  return [c * tx + s * ty + centerX, c * ty - s * tx + centerY];
}

export function linesIntersect(
  p1StartX: number,
  p1StartY: number,
  p1EndX: number,
  p1EndY: number,
  p2StartX: number,
  p2StartY: number,
  p2EndX: number,
  p2EndY: number,
  out?: Vec2
): boolean {
  let bx = p1EndX - p1StartX;
  let by = p1EndY - p1StartY;
  const dx = p2EndX - p2StartX;
  const dy = p2EndY - p2StartY;

  const bDot = bx * dy - by * dx;
  if (bDot === 0) {
    return false;
  }

  const cx = p2StartX - p1StartX;
  const cy = p2StartY - p1StartY;
  const t = (cx * dy - cy * dx) / bDot;
  if (t < 0 || t > 1) {
    return false;
  }

  const u = (cx * by - cy * bx) / bDot;
  if (u < 0 || u > 1) {
    return false;
  }

  if (out) {
    out.set(p1StartX, p1StartY);
    bx *= t;
    by *= t;
    out.x += bx;
    out.y += by;
  }

  return true;
}
