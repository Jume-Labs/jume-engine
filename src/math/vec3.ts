import { Mat4 } from './mat4';

export class Vec3 {
  x: number;
  y: number;
  z: number;

  static readonly POOL: Vec3[] = [];

  static get(x = 0, y = 0, z = 0): Vec3 {
    if (Vec3.POOL.length > 0) {
      const vec = Vec3.POOL.pop()!;
      vec.set(x, y, z);

      return vec;
    }

    return new Vec3(x, y, z);
  }

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  equals(vec: Vec3): boolean {
    return this.x === vec.x && this.y === vec.y && this.z === vec.z;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone(out?: Vec3): Vec3 {
    if (out) {
      out.set(this.x, this.y, this.z);
      return out;
    }

    return new Vec3(this.x, this.y, this.z);
  }

  copyFrom(vec: Vec3) {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
  }

  transformMat4({ value }: Mat4, vec?: { x: number; y: number; z: number }) {
    const { x, y, z } = vec ?? {
      x: this.x,
      y: this.y,
      z: this.z,
    };
    let w = value[3] * x + value[7] * y + value[11] * z + value[15];
    if (w === 0) {
      w = 1;
    }

    this.x = (value[0] * x + value[4] * y + value[8] * z + value[12]) / w;
    this.y = (value[1] * x + value[5] * y + value[9] * z + value[13]) / w;
    this.x = (value[2] * x + value[6] * y + value[10] * z + value[14]) / w;
  }

  toString(): string {
    return `{ x: ${this.x}, y: ${this.y}, z: ${this.z} }`;
  }

  put() {
    Vec3.POOL.push(this);
  }
}
