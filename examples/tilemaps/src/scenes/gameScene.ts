import { inject, Scene, SRender, View } from '@jume-labs/jume-engine';

import { EBorder } from '../entities/eBorder';
import { EButton } from '../entities/eButton';
import { ECursor } from '../entities/eCursor';
import { ELevel } from '../entities/eLevel';
import { ESelector } from '../entities/eSelector';
import { SLevelEdit } from '../systems/sLevelEdit';

export class GameScene extends Scene {
  @inject
  private view!: View;

  constructor() {
    super();

    this.addSystem(SLevelEdit, 0, { camera: this.cameras[0] });
    this.addSystem(SRender, 0, {});

    this.addEntity(EBorder);
    this.addEntity(ELevel);

    this.addEntity(ECursor);

    this.addEntity(EButton, { x: this.view.viewCenterX - 34, y: this.view.viewHeight - 30, index: 0 });
    this.addEntity(EButton, { x: this.view.viewCenterX, y: this.view.viewHeight - 30, index: 1 });
    this.addEntity(EButton, { x: this.view.viewCenterX + 34, y: this.view.viewHeight - 30, index: 2 });

    this.addEntity(ESelector, { x: this.view.viewCenterX - 34, y: this.view.viewHeight - 30 });
  }
}
