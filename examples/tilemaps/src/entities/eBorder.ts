import { Assets, Atlas, CSprite, CTransform, Entity, inject } from '@jume-labs/jume-engine';

export class EBorder extends Entity {
  @inject
  private assets!: Assets;

  constructor() {
    super();

    const atlas = this.assets.get(Atlas, 'sprites');

    this.addComponent(CTransform, { x: 16, y: 16 });
    this.addComponent(CSprite, { atlas, frameName: 'border', anchor: { x: 0, y: 0 } });
  }
}
