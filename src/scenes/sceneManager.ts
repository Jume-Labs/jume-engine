import { Graphics } from '../graphics/graphics';
import { Scene } from './scene';

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

  push(scene: Scene, removeCurrent = false, below = false, removeAll = false): void {
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

    if (scene.isOverlay && this.stack.length > 0 && !this.current.pauseInOverlay) {
      this.current.resume();
    }

    this.addScene(scene, below);
  }

  pop(): void {
    if (this.stack.length > 1) {
      this.stack.pop()!.destroy();
    }
    this.current.resume();
  }

  private addScene(scene: Scene, below: boolean): void {
    if (below) {
      if (this.stack.length <= 1) {
        this.stack.unshift(scene);
      } else {
        this.stack.splice(this.stack.length - 2, 0, scene);
      }
      scene.pause();
    } else {
      this.stack.push(scene);
    }
  }
}
