import { BitmapFont } from 'src/graphics/bitmapFont';
import { Color } from 'src/graphics/color';
import { Graphics } from 'src/graphics/graphics';
import { Vec2 } from 'src/math/vec2';

import { Component, Renderable } from '../component';

export interface CTextOptions {
  font: BitmapFont;
  text: string;
  tint?: Color;
  anchor?: { x: number; y: number };
}

export class CText extends Component implements Renderable {
  font?: BitmapFont;

  text = '';

  anchor = new Vec2(0.5, 0.5);

  tint = new Color(1, 1, 1, 1);

  get width(): number {
    return this.font?.width(this.text) ?? 0;
  }

  get height(): number {
    return this.font?.height ?? 0;
  }

  init(options: CTextOptions): CText {
    this.font = options.font;
    this.text = options.text;

    if (options.tint) {
      this.tint.copyFrom(options.tint);
    }
    this.active = true;

    if (options.anchor) {
      this.anchor.set(options.anchor.x, options.anchor.y);
    }

    return this;
  }

  render(graphics: Graphics): void {
    if (!this.font) {
      return;
    }

    graphics.color.copyFrom(this.tint);
    graphics.drawBitmapText(-this.width * this.anchor.x, -this.height * this.anchor.y, this.font, this.text);
  }

  debugRender(_graphics: Graphics): void {}
}
