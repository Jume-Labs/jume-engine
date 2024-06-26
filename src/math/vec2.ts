/**
 * Vector 2 class. Can be used for positions for example.
 */
export class Vec2 {
  static readonly LEFT = new Vec2(-1, 0);
  static readonly RIGHT = new Vec2(1, 0);
  static readonly UP = new Vec2(0, -1);
  static readonly DOWN = new Vec2(0, 1);
  static readonly ZERO = new Vec2(0, 0);

  /**
   * The x axis position.
   */
  x: number;

  /**
   * The y axis position.
   */
  y: number;

  /**
   * Get the length of this vector.
   */
  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Set a new length.
   */
  set length(value: number) {
    this.normalize();

    this.x *= value;
    this.y *= value;
  }

  private static readonly POOL: Vec2[] = [];

  static get(x = 0, y = 0): Vec2 {
    if (Vec2.POOL.length > 0) {
      const vec = Vec2.POOL.pop()!;
      vec.set(x, y);

      return vec;
    }

    return new Vec2(x, y);
  }

  /**
   * Get the distance between two vectors.
   * @param a The first vector.
   * @param b The second vector.
   * @returns The distance.
   */
  static distance(a: Vec2, b: Vec2): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  /**
   * Create a new vec2 instance.
   * @param x The x axis position.
   * @param y The y axis position.
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Set new vector values.
   * @param x The x axis position.
   * @param y The y axis position.
   */
  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Clone this vector.
   * @param out Optional vector to store the result in.
   * @returns The cloned vector.
   */
  clone(out?: Vec2): Vec2 {
    if (!out) {
      return Vec2.get(this.x, this.y);
    }

    out.set(this.x, this.y);

    return out;
  }

  /**
   * Copy the values from another vector.
   * @param vec The vector to copy from.
   */
  copyFrom(vec: Vec2): void {
    this.set(vec.x, vec.y);
  }

  /**
   * Compare two vectors.
   * @param vec The vector to compare this vector with.
   * @returns True if the vectors are the same.
   */
  equals(vec: Vec2): boolean {
    return this.x === vec.x && this.y === vec.y;
  }

  add(vec: Vec2): void {
    this.x += vec.x;
    this.y += vec.y;
  }

  sub(vec: Vec2): void {
    this.x -= vec.x;
    this.y -= vec.y;
  }

  mul(vec: Vec2): void {
    this.x *= vec.x;
    this.y *= vec.y;
  }

  div(vec: Vec2): void {
    this.x /= vec.x;
    this.y /= vec.y;
  }

  dot(vec: Vec2): number {
    return this.x * vec.x + this.y * vec.y;
  }

  normalize(): void {
    const l = this.length;
    if (l > 0) {
      this.x /= l;
      this.y /= l;
    }
  }

  rotateAround(centerX: number, centerY: number, angle: number): void {
    const rad = angle * (Math.PI / 180.0);
    const c = Math.cos(rad);
    const s = Math.sin(rad);

    const tx = this.x - centerX;
    const ty = this.y - centerY;

    this.x = c * tx + s * ty + this.x;
    this.y = c * ty - s * tx + this.y;
  }

  toString(): string {
    return `{ x: ${this.x}, y: ${this.y} }`;
  }

  put(): void {
    Vec2.POOL.push(this);
  }
}
