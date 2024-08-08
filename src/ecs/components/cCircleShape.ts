import { Color } from '../../graphics/color.js';
import { Graphics } from '../../graphics/graphics.js';
import { Vec2 } from '../../math/vec2.js';
import { BaseComponentProps, Component, Renderable } from '../component.js';

export type CCircleShapeProps = BaseComponentProps & {
  radius: number;
  segments?: number;
  filled?: boolean;
  stroke?: boolean;
  strokeColor?: Color;
  strokeWidth?: number;
  fillColor?: Color;
  anchor?: { x: number; y: number };
};

export class CCircleShape extends Component implements Renderable {
  strokeColor = new Color(1, 1, 1, 1);

  fillColor = new Color(1, 1, 1, 1);

  anchor = new Vec2();

  radius: number;

  segments: number;

  filled: boolean;

  stroke: boolean;

  strokeWidth: number;

  constructor(props: CCircleShapeProps) {
    super(props);

    const { radius, filled, strokeColor, strokeWidth, fillColor, anchor, stroke, segments } = props;

    this.radius = radius;
    this.segments = segments ?? 48;
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
      graphics.drawSolidCircle(-this.radius * this.anchor.x, -this.radius * this.anchor.y, this.radius, this.segments);
    }

    if (this.stroke) {
      graphics.color.copyFrom(this.strokeColor);
      graphics.drawCircle(
        -this.radius * this.anchor.x,
        -this.radius * this.anchor.y,
        this.radius,
        this.segments,
        this.strokeWidth
      );
    }
  }
}
