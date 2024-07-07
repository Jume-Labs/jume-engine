import { Color } from 'src/graphics/color';

import { clamp } from './mathUtils';

const MULTIPLIER = 48271.0;

const MODULUS = 0x7fffffff;

export class Random {
  get startSeed(): number {
    return this.initialSeed;
  }

  set startSeed(value: number) {
    this.initialSeed = this.currentSeed = this.rangeBound(value);
  }

  get currentSeed(): number {
    return Math.floor(this.internalSeed);
  }

  set currentSeed(value: number) {
    this.internalSeed = Math.floor(this.rangeBound(value));
  }

  private internalSeed = 1.0;

  private initialSeed = 1;

  constructor() {
    this.resetSeed();
  }

  resetSeed(): void {
    this.startSeed = this.rangeBound(Math.floor(Math.random() * MODULUS));
  }

  int(min = 0, max = MODULUS): number {
    if (min === 0 && max === MODULUS) {
      return Math.floor(this.generate());
    } else if (min === max) {
      return Math.floor(min);
    } else {
      if (min > max) {
        const temp = max;
        max = min;
        min = temp;
      }

      return Math.floor(min + (this.generate() / MODULUS) * (max - min + 1));
    }
  }

  float(min = 0, max = 1): number {
    if (min === 0 && max === 1) {
      return this.generate() / MODULUS;
    } else if (min === max) {
      return min;
    } else {
      if (min > max) {
        const temp = max;
        max = min;
        min = temp;
      }

      return min + (this.generate() / MODULUS) * (max - min);
    }
  }

  color(min = 0, max = 1, rndAlpha = true): Color {
    min = clamp(min, 0, 1);
    max = clamp(max, 0, 1);
    const alpha = rndAlpha ? this.float(min, max) : 1.0;

    return new Color(this.float(min, max), this.float(min, max), this.float(min, max), alpha);
  }

  private generate(): number {
    return (this.internalSeed = (this.internalSeed * MULTIPLIER) % MODULUS);
  }

  private rangeBound(value: number): number {
    return clamp(value, 1, MODULUS - 1);
  }
}
