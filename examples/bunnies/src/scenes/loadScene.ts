import { AssetItem, AssetManager, Atlas, BitmapFont, Image, inject, Scene, SceneManager } from '@jume-labs/jume-engine';

import { BunnyScene } from './bunnyScene';

export class LoadScene extends Scene {
  @inject
  private assetManager!: AssetManager;

  @inject
  private sceneManager!: SceneManager;

  constructor() {
    super();

    this.loadAssets()
      .then(() => {
        this.sceneManager.changeScene({ type: 'push', sceneType: BunnyScene, removeCurrent: true });
      })
      .catch((reason) => {
        throw reason;
      });
  }

  private async loadAssets(): Promise<void> {
    const assets: AssetItem[] = [
      {
        type: Atlas,
        id: 'sprites',
        path: 'assets/sprites',
      },
      {
        type: Image,
        id: 'bunny',
        path: 'assets/bunny.png',
      },
      {
        type: BitmapFont,
        id: 'font',
        path: 'assets/pixelFont',
      },
    ];
    await this.assetManager.loadAll(assets);
  }
}
