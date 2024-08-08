import { Assets, Atlas, CSprite, CTransform, Entity, inject } from '@jume-labs/jume-engine';

import { CSelector } from '../components/cSelector';

export type ESelectorProps {
  x: number;
  y: number;
}

export class ESelector extends Entity {
  @inject
  private assets!: Assets;

  constructor(props: ESelectorProps) {
    super();
    this.layer = 3;

    const { x, y } = props;
    const atlas = this.assets.get(Atlas, 'sprites');

    this.addComponent(CTransform, { x, y });
    this.addComponent(CSprite, { atlas, frameName: 'selector' });
    this.addComponent(CSelector, {});
  }
}
