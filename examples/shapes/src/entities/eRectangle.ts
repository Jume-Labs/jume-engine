import { CBoxShape, Color, CTransform, Entity } from '@jume-labs/jume-engine';

export type ERectangleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  filled?: boolean;
  stroke?: boolean;
  fillColor?: Color;
  strokeColor?: Color;
  strokeWidth?: number;
};

export class ERectangle extends Entity {
  transform: CTransform;

  shape: CBoxShape;

  constructor(props: ERectangleProps) {
    super();

    const { x, y, width, height, rotation, filled, stroke, fillColor, strokeColor, strokeWidth } = props;

    this.transform = this.addComponent(CTransform, { x, y, rotation });
    this.shape = this.addComponent(CBoxShape, {
      width,
      height,
      stroke,
      filled,
      strokeColor,
      fillColor,
      strokeWidth,
    });
  }
}
