import { Color, Scene, SRender, Vec2 } from '@jume-labs/jume-engine';

import { ECircle } from '../entities/eCircle';
import { EPolygon } from '../entities/ePolygon';
import { ERectangle } from '../entities/eRectangle';

export class ShapesScene extends Scene {
  constructor() {
    super();

    this.addSystem(SRender, 0, {});

    this.addEntity(ERectangle, { x: 100, y: 100, width: 120, height: 80 });

    this.addEntity(ERectangle, {
      x: 250,
      y: 100,
      width: 80,
      height: 50,
      filled: true,
      stroke: false,
      fillColor: Color.ORANGE,
    });

    this.addEntity(ECircle, { radius: 60, x: 400, y: 200, strokeWidth: 3 });

    const vertices: Vec2[] = [new Vec2(0, 0), new Vec2(50, -50), new Vec2(100, 0), new Vec2(75, 50), new Vec2(25, 50)];
    this.addEntity(EPolygon, { x: 400, y: 500, vertices, filled: true });
  }
}
