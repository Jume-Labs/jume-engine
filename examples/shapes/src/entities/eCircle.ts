import { CCircleShape, Color, CTransform, Entity } from '@jume-labs/jume-engine';

export type ECircleProps = {
  x: number;
  y: number;
  radius: number;
  segments?: number;
  stroke?: boolean;
  filled?: boolean;
  strokeColor?: Color;
  fillColor?: Color;
  strokeWidth?: number;
};

export class ECircle extends Entity {
  transform: CTransform;

  shape: CCircleShape;

  constructor(props: ECircleProps) {
    super();

    const { x, y, radius, segments, stroke, filled, strokeColor, fillColor, strokeWidth } = props;

    this.transform = this.addComponent(CTransform, { x, y });
    this.shape = this.addComponent(CCircleShape, {
      radius,
      segments,
      stroke,
      filled,
      strokeColor,
      fillColor,
      strokeWidth,
    });
  }
}
