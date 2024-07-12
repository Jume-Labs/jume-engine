import { Graphics } from '../graphics/graphics.js';
import { Scene, SceneType } from './scene.js';

export class SceneManager {
  get current(): Scene {
    return this.stack[this.stack.length - 1];
  }

  private readonly stack: Scene[];

  constructor() {
    this.stack = [];
  }

  update(dt: number): void {
    if (this.current.isOverlay && this.stack.length > 1) {
      const below = this.stack[this.stack.length - 2];
      if (!below.pauseInOverlay) {
        below.update(dt);
      }
    }

    this.current.update(dt);
  }

  render(graphics: Graphics): void {
    if (this.current.isOverlay && this.stack.length > 1) {
      this.stack[this.stack.length - 2].render(graphics);
    }

    this.current.render(graphics);
  }

  push(sceneType: SceneType, removeCurrent = false, below = false, removeAll = false): void {
    if (removeCurrent) {
      this.stack.pop()!.destroy();
    }

    if (!below && this.stack.length > 0) {
      this.current.pause();
    }

    if (removeAll) {
      while (this.stack.length > 0) {
        this.stack.pop()!.destroy();
      }
    }

    const scene = this.addScene(sceneType, below);

    if (scene.isOverlay && this.stack.length > 0 && !this.current.pauseInOverlay) {
      this.current.resume();
    }
  }

  pop(): void {
    if (this.stack.length > 1) {
      this.stack.pop()!.destroy();
    }
    this.current.resume();
  }

  private addScene(sceneType: SceneType, below: boolean): Scene {
    const scene = new sceneType();
    if (below) {
      if (this.stack.length <= 1) {
        this.stack.unshift(scene);
      } else {
        this.stack.splice(this.stack.length - 2, 0, scene);
      }
      scene.init();
      scene.pause();
    } else {
      this.stack.push(scene);
      scene.init();
    }

    return scene;
  }
}
