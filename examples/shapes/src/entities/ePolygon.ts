import { Color, CPolygonShape, CTransform, Entity, Vec2 } from '@jume-labs/jume-engine';

export type EPolygonProps = {
  x: number;
  y: number;
  vertices: Vec2[];
  filled?: boolean;
  stroke?: boolean;
  fillColor?: Color;
  strokeColor?: Color;
  strokeWidth?: number;
};

export class EPolygon extends Entity {
  transform: CTransform;

  shape: CPolygonShape;

  constructor(props: EPolygonProps) {
    super();

    const { x, y, vertices, filled, stroke, fillColor, strokeColor, strokeWidth } = props;

    this.transform = this.addComponent(CTransform, { x, y });
    this.shape = this.addComponent(CPolygonShape, { vertices, filled, stroke, fillColor, strokeColor, strokeWidth });
  }
}
