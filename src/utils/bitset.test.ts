import { describe, expect, it } from 'vitest';

import { Bitset } from './bitset.js';

describe('utils/bitset', () => {
  it('Should create a bitset', () => {
    const set = new Bitset(0b0001);
    expect(set.value).toBe(0b0001);
  });

  it('Should add a mask', () => {
    const set = new Bitset(0b0001);
    set.add(0b1000);
    expect(set.value).toBe(0b1001);
  });

  it('Should remove a mask', () => {
    const set = new Bitset(0b1111);
    set.remove(0b1010);
    expect(set.value).toBe(0b0101);
  });

  it('Should check if it has a mask', () => {
    const set = new Bitset(0b0011);
    expect(set.has(0b0010)).toBeTruthy();
    expect(set.has(0b0011)).toBeTruthy();
    expect(set.has(0b0111)).toBeFalsy();
  });
});
