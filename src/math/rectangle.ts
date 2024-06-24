import { distance, linesIntersect } from './mathUtils';
import { Vec2 } from './vec2';

export class Rectangle {
  x: number;

  y: number;

  width: number;

  height: number;

  private tempOut = new Vec2();

  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  hasPoint(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }

  intersects(rect: Rectangle): boolean {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }

  set(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  intersectsLine(startX: number, startY: number, endX: number, endY: number, out?: Vec2): boolean {
    let intersects = false;
    this.tempOut.copyFrom(Vec2.ZERO);
    const lines: number[][] = [
      [this.x, this.y, this.x + this.width, this.y],
      [this.x + this.width, this.y, this.x + this.width, this.y + this.height],
      [this.x, this.y + this.height, this.x + this.width, this.y + this.height],
      [this.x, this.y, this.x, this.y + this.height],
    ];

    for (const line of lines) {
      if (linesIntersect(startX, startY, endX, endY, line[0], line[1], line[2], line[3])) {
        intersects = true;
        if (out) {
          if (out === Vec2.ZERO) {
            out.copyFrom(this.tempOut);
          } else {
            if (distance(startX, startY, this.tempOut.x, this.tempOut.y) < distance(startX, startY, out.x, out.y)) {
              out.copyFrom(this.tempOut);
            }
          }
        }
      }
    }

    return intersects;
  }

  toString(): string {
    return `{ x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height} }`;
  }
}
