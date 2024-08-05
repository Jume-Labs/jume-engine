import { Assets, Atlas, inject, Scene, Scenes, Tileset } from '@jume-labs/jume-engine';

import { GameScene } from './gameScene';

export class LoadScene extends Scene {
  @inject
  private assets!: Assets;

  @inject
  private scenes!: Scenes;

  constructor() {
    super();

    this.loadAssets()
      .then(() => {
        this.scenes.changeScene({ type: 'push', sceneType: GameScene, removeCurrent: true });
      })
      .catch((reason) => {
        throw reason;
      });
  }

  private async loadAssets(): Promise<void> {
    await this.assets.loadAll([
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
