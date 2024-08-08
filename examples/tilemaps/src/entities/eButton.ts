import { Assets, CTransform, Entity, inject, Tileset } from '@jume-labs/jume-engine';

import { CButton } from '../components/cButton';

export type EButtonProps {
  x: number;
  y: number;
  index: number;
}

export class EButton extends Entity {
  @inject
  private assets!: Assets;

  constructor(props: EButtonProps) {
    super();

    const { x, y, index } = props;
    const tileset = this.assets.get(Tileset, 'tiles');

    this.addComponent(CTransform, { x, y });
    this.addComponent(CButton, { tileset, index });
  }
}
