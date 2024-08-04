import { AssetManager, CTransform, Entity, inject, Tileset } from '@jume-labs/jume-engine';

import { CButton } from '../components/cButton';

export interface EButtonProps {
  x: number;
  y: number;
  index: number;
}

export class EButton extends Entity {
  @inject
  private assetManager!: AssetManager;

  constructor(props: EButtonProps) {
    super();

    const { x, y, index } = props;
    const tileset = this.assetManager.getAsset(Tileset, 'tiles');

    this.addComponent(CTransform, { x, y });
    this.addComponent(CButton, { tileset, index });
  }
}
