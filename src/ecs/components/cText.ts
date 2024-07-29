import { BitmapFont } from '../../graphics/bitmapFont.js';
import { Color } from '../../graphics/color.js';
import { Graphics } from '../../graphics/graphics.js';
import { Vec2 } from '../../math/vec2.js';
import { BaseComponentProps, Component, Renderable } from '../component.js';

export interface CTextProps extends BaseComponentProps {
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

  constructor(props: CTextProps) {
    super(props);

    const { font, text, tint, anchor } = props;

    this.font = font;
    this.text = text;

    if (tint) {
      this.tint.copyFrom(tint);
    }

    if (anchor) {
      this.anchor.set(anchor.x, anchor.y);
    }

    return this;
  }

  cRender(graphics: Graphics): void {
    if (!this.font) {
      return;
    }

    graphics.color.copyFrom(this.tint);
    graphics.drawBitmapText(-this.width * this.anchor.x, -this.height * this.anchor.y, this.font, this.text);
  }
}
