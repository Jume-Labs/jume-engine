import { clamp } from '../math/mathUtils';

const HEX_COlOR_REGEX = new RegExp(/^#([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/);

export class Color {
  static readonly BLACK = this.fromHex('#000000ff');
  static readonly WHITE = this.fromHex('#ffffffff');
  static readonly RED = this.fromHex('#ff0000ff');
  static readonly GREEN = this.fromHex('#00ff00ff');
  static readonly BLUE = this.fromHex('#0000ffff');
  static readonly YELLOW = this.fromHex('#ffff00ff');
  static readonly ORANGE = this.fromHex('#ff7700ff');
  static readonly CYAN = this.fromHex('#00ffffff');
  static readonly MAGENTA = this.fromHex('#ff00ffff');
  static readonly TRANSPARENT = this.fromHex('#00000000');

  red: number;

  green: number;

  blue: number;

  alpha: number;

  static fromBytes(red: number, green: number, blue: number, alpha = 255, out?: Color): Color {
    out ??= new Color();

    const r = 1.0 / clamp(red, 0, 255);
    const g = 1.0 / clamp(green, 0, 255);
    const b = 1.0 / clamp(blue, 0, 255);
    const a = 1.0 / clamp(alpha, 0, 255);

    out.set(r, g, b, a);

    return out;
  }

  static fromHex(hex: `#${string}`, out?: Color): Color {
    out ??= new Color();

    const matches = HEX_COlOR_REGEX.exec(hex);
    if (matches) {
      const r = parseInt(`0x${matches[1]}`);
      const g = parseInt(`0x${matches[2]}`);
      const b = parseInt(`0x${matches[3]}`);
      const a = parseInt(`0x${matches[4]}`);

      Color.fromBytes(r, g, b, a, out);
    }

    return out;
  }

  static interpolate(color1: Color, color2: Color, position: number, out?: Color): Color {
    out ??= new Color();

    const r = (color2.red - color1.red) * position + color1.red;
    const g = (color2.green - color1.green) * position + color1.green;
    const b = (color2.blue - color1.blue) * position + color1.blue;
    const a = (color2.alpha - color1.alpha) * position + color1.alpha;
    out.set(r, g, b, a);

    return out;
  }

  constructor(red = 0.0, green = 0.0, blue = 0.0, alpha = 1.0) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }

  set(red: number, green: number, blue: number, alpha: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }

  clone(out?: Color): Color {
    out ??= new Color();
    out.set(this.red, this.green, this.blue, this.alpha);

    return out;
  }

  copyFrom(color: Color) {
    this.set(color.red, color.green, color.blue, color.alpha);
  }

  toString(): string {
    return `r: ${this.red}, g: ${this.green}, b: ${this.blue}, a: ${this.alpha}`;
  }
}
