import { AssetManager, Atlas, inject, Scene, SceneManager, Tileset } from '@jume-labs/jume-engine';

import { GameScene } from './gameScene';

export class LoadScene extends Scene {
  @inject
  private assetManager!: AssetManager;

  @inject
  private sceneManager!: SceneManager;

  constructor() {
    super();

    this.loadAssets()
      .then(() => {
        this.sceneManager.changeScene({ type: 'push', sceneType: GameScene, removeCurrent: true });
      })
      .catch((reason) => {
        throw reason;
      });
  }

  private async loadAssets(): Promise<void> {
    await this.assetManager.loadAll([
      {
        type: Atlas,
        id: 'sprites',
        path: 'assets/sprites',
      },
      {
        type: Tileset,
        id: 'tiles',
        path: 'assets/tiles.png',
        props: {
          tileWidth: 20,
          tileHeight: 20,
          spacing: 2,
          margin: 1,
        },
      },
    ]);
  }
}
