import { Color } from '../../graphics/color.js';
import { Graphics } from '../../graphics/graphics.js';
import { Vec2 } from '../../math/vec2.js';
import { BaseComponentProps, Component, Renderable } from '../component.js';

export type CBoxShapeProps = BaseComponentProps & {
  width: number;
  height: number;
  filled?: boolean;
  stroke?: boolean;
  fillColor?: Color;
  strokeColor?: Color;
  strokeWidth?: number;
  anchor?: { x: number; y: number };
};

export class CBoxShape extends Component implements Renderable {
  strokeColor = new Color(1, 1, 1, 1);

  fillColor = new Color(1, 1, 1, 1);

  anchor = new Vec2(0.5, 0.5);

  width: number;

  height: number;

  filled: boolean;

  stroke: boolean;

  strokeWidth: number;

  constructor(props: CBoxShapeProps) {
    super(props);

    const { width, height, filled, strokeColor, strokeWidth, fillColor, anchor, stroke } = props;

    this.width = width;
    this.height = height;
    this.filled = filled ?? false;
    this.stroke = stroke ?? true;

    if (strokeColor) {
      this.strokeColor.copyFrom(strokeColor);
    }
    if (fillColor) {
      this.fillColor.copyFrom(fillColor);
    }

    this.strokeWidth = strokeWidth ?? 1;

    if (anchor) {
      this.anchor.set(anchor.x, anchor.y);
    }
  }

  cRender(graphics: Graphics): void {
    if (this.filled) {
      graphics.color.copyFrom(this.fillColor);
      graphics.drawSolidRect(-this.width * this.anchor.x, -this.height * this.anchor.y, this.width, this.height);
    }

    if (this.stroke) {
      graphics.color.copyFrom(this.strokeColor);
      graphics.drawRect(
        -this.width * this.anchor.x,
        -this.height * this.anchor.y,
        this.width,
        this.height,
        this.strokeWidth
      );
    }
  }
}
