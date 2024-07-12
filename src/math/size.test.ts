import { describe, expect, it } from 'vitest';

import { Size } from './size.js';

describe('math/size', () => {
  it('should create a new size', () => {
    const size = new Size(24, 19);

    expect(size.width).toBe(24);
    expect(size.height).toBe(19);
  });

  it('should return a string representation of a size', () => {
    const size = new Size(26, 20);

    expect(size.toString()).toBe('{ w: 26, h: 20 }');
  });
});
