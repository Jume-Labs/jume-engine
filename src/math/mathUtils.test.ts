import { describe, expect, it } from 'vitest';

import { clamp, distance, fuzzyEqual, lerp, rotateAround, toDeg, toRad } from './mathUtils';

describe('math/mathUtils', () => {
  it('should lerp between two values', () => {
    let actual = lerp(0, 20, 0);
    expect(actual).toBe(0);

    actual = lerp(0, 20, 0.5);
    expect(actual).toBe(10);

    actual = lerp(0, 20, 0.75);
    expect(actual).toBe(15);

    actual = lerp(0, 20, 1.0);
    expect(actual).toBe(20);
  });

  it('should clamp a value', () => {
    let actual = clamp(20, 20, 30);
    expect(actual).toBe(20);

    actual = clamp(19, 20, 30);
    expect(actual).toBe(20);

    actual = clamp(30, 20, 30);
    expect(actual).toBe(30);

    actual = clamp(35, 20, 30);
    expect(actual).toBe(30);
  });

  it('should convert radians to degrees', () => {
    const actual = toDeg(3.1417);
    expect(actual).toBeCloseTo(180.00615);
  });

  it('should convert degrees to radians', () => {
    const actual = toRad(90);
    expect(actual).toBeCloseTo(1.57079);
  });

  it('should calculate the distance between two points', () => {
    const actual = distance(2, 8, 12, 15);
    expect(actual).toBeCloseTo(12.20655);
  });

  it('should compare fuzzy', () => {
    expect(fuzzyEqual(1.000004, 1.0000089)).toBeTruthy();
    expect(fuzzyEqual(1.004, 1.0089)).toBeFalsy();
    expect(fuzzyEqual(1.000004, 1.0000089, 0.000001)).toBeFalsy();
  });

  it('should rotate a point around another point', () => {
    let vec = rotateAround(0, 100, 100, 100, 90);
    expect(vec.x).toBeCloseTo(100);
    expect(vec.y).toBeCloseTo(0);

    vec = rotateAround(0, 100, 100, 100, 270);
    expect(vec.x).toBeCloseTo(100);
    expect(vec.y).toBeCloseTo(200);
  });
});
