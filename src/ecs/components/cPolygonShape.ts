import { Color } from '../../graphics/color.js';
import { Graphics } from '../../graphics/graphics.js';
import { Vec2 } from '../../math/vec2.js';
import { BaseComponentProps, Component, Renderable } from '../component.js';

export interface CPolygonShapeProps extends BaseComponentProps {
  vertices: Vec2[];
  filled?: boolean;
  stroke?: boolean;
  fillColor?: Color;
  strokeColor?: Color;
  strokeWidth?: number;
}

export class CPolygonShape extends Component implements Renderable {
  strokeColor = new Color(1, 1, 1, 1);

  fillColor = new Color(1, 1, 1, 1);

  vertices: Vec2[];

  filled: boolean;

  stroke: boolean;

  strokeWidth: number;

  constructor(props: CPolygonShapeProps) {
    super(props);

    const { vertices, fillColor, filled, stroke, strokeColor, strokeWidth } = props;

    this.vertices = vertices;
    this.filled = filled ?? false;
    this.stroke = stroke ?? true;

    if (strokeColor) {
      this.strokeColor.copyFrom(strokeColor);
    }

    if (fillColor) {
      this.fillColor.copyFrom(fillColor);
    }

    this.strokeWidth = strokeWidth ?? 1;
  }

  cRender(graphics: Graphics): void {
    if (this.filled) {
      graphics.color.copyFrom(this.fillColor);
      graphics.drawSolidPolygon(0, 0, this.vertices);
    }

    if (this.stroke) {
      graphics.color.copyFrom(this.strokeColor);
      graphics.drawPolygon(0, 0, this.vertices, this.strokeWidth);
    }
  }
}
