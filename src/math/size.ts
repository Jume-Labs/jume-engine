/**
 * Stores a width and a height.
 */
export class Size {
  /**
   * The horizontal size.
   */
  width: number;

  /**
   * The vertical size.
   */
  height: number;

  /**
   * Create a new size instance.
   * @param width The horizontal size.
   * @param height The vertical size.
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   *
   * @returns A string representation of this size.
   */
  toString(): string {
    return `{ w: ${this.width}, h: ${this.height} }`;
  }
}
