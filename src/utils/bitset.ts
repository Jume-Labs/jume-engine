/**
 * Bitmask helper class.
 */
export class Bitset {
  value: number;

  constructor(value = 0) {
    this.value = value;
  }

  add(mask: number): void {
    this.value |= mask;
  }

  remove(mask: number): void {
    this.value &= ~mask;
  }

  has(mask: number): boolean {
    return (this.value & mask) === mask;
  }

  hasAll(masks: number[]): boolean {
    for (const mask of masks) {
      if (!this.has(mask)) {
        return false;
      }
    }

    return true;
  }

  clear(): void {
    this.value = 0;
  }
}
