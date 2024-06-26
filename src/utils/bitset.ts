/**
 * Bitmask helper class.
 */
export class Bitset {
  value: number;

  constructor(value = 0) {
    this.value = value;
  }

  add(mask: number) {
    this.value |= mask;
  }

  remove(mask: number) {
    this.value &= ~mask;
  }

  has(mask: number): boolean {
    return (this.value & mask) !== 0;
  }

  hasAll(masks: number[]): boolean {
    for (const mask of masks) {
      if (!this.has(mask)) {
        return false;
      }
    }

    return true;
  }

  clear() {
    this.value = 0;
  }
}
