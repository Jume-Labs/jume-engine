import { Assets, Atlas, CSprite, CTransform, Entity, inject } from '@jume-labs/jume-engine';

import { CCursor } from '../components/cCursor';

export class ECursor extends Entity {
  @inject
  private assets!: Assets;

  constructor() {
    super();
    this.active = false;
    this.layer = 3;

    const atlas = this.assets.get(Atlas, 'sprites');

    this.addComponent(CTransform, {});
    this.addComponent(CSprite, { atlas, frameName: 'cursor' });
    this.addComponent(CCursor, {});
  }
}
