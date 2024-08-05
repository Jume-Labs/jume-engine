import { Assets, Atlas, CSprite, CTransform, Entity, inject, Random } from '@jume-labs/jume-engine';

import { CBunnyMove } from '../components/cBunnyMove';

export class EBunny extends Entity {
  @inject
  private readonly assets!: Assets;

  @inject
  private readonly random!: Random;

  constructor() {
    super();

    this.addComponent(CTransform, {});

    const atlas = this.assets.get(Atlas, 'sprites');
    const tint = this.random.color(0.3);

    this.addComponent(CSprite, { atlas, frameName: 'bunny', tint });
    this.addComponent(CBunnyMove, {});
  }
}
