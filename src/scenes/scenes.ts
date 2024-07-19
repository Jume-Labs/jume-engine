import { inject } from '../di/inject.js';
import { Entity } from '../ecs/entity.js';
import { EntityManager } from '../ecs/entityManager.js';
import { System, SystemType } from '../ecs/system.js';
import { SystemManager } from '../ecs/systemManager.js';
import { Graphics } from '../graphics/graphics.js';
import { TweenManager } from '../tweens/tweenManager.js';
import { Camera } from '../view/camera.js';
import { View } from '../view/view.js';

export type SceneType = new () => Scene;

export type SceneChangeType = 'push' | 'pop';

export interface SceneChange {
  sceneType: SceneType;
  type: SceneChangeType;
  removeCurrent?: boolean;
  below?: boolean;
  removeAll?: boolean;
}

export class Scene {
  isOverlay = false;

  pauseInOverlay = true;

  @inject
  protected view!: View;

  private readonly cameras: Camera[];

  private readonly entityManager: EntityManager;

  private readonly systemManager: SystemManager;

  private readonly tweenManager: TweenManager;

  constructor() {
    this.cameras = [new Camera()];
    this.systemManager = new SystemManager(this.view, this.cameras);
    this.entityManager = new EntityManager(this.systemManager);
    this.tweenManager = new TweenManager();
  }

  addEntity(entity: Entity): void {
    this.entityManager.add(entity);
  }

  removeEntity(entity: Entity): boolean {
    return this.entityManager.remove(entity);
  }

  removeEntityId(id: number): boolean {
    return this.entityManager.removeById(id);
  }

  getEntityById(id: number): Entity | undefined {
    return this.entityManager.getById(id);
  }

  addSystem<T extends System, P = unknown>(systemType: SystemType<T>, props: P, order = 0): T {
    return this.systemManager.addSystem(systemType, props, order);
  }

  removeSystem(systemType: typeof System): boolean {
    return this.systemManager.removeSystem(systemType);
  }

  update(dt: number): void {
    this.tweenManager.update(dt);
    this.entityManager.update();
    this.systemManager.update(dt);
  }

  render(graphics: Graphics): void {
    this.systemManager.render(graphics);
  }

  resize(_width: number, _height: number): void {
    for (const camera of this.cameras) {
      camera.resize();
    }
  }

  toBackground(): void {}

  toForeground(): void {}

  pause(): void {}

  resume(): void {}

  destroy(): void {
    this.entityManager.destroy();
    this.systemManager.destroy();
  }
}

export class SceneManager {
  get current(): Scene {
    return this.stack[this.stack.length - 1];
  }

  private readonly stack: Scene[];

  private nextScene?: SceneChange;

  constructor() {
    this.stack = [];
  }

  update(dt: number): void {
    if (this.nextScene) {
      const scene = this.nextScene;
      this.nextScene = undefined;
      this.goToNextScene(scene);
    }

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

  changeScene(change: SceneChange): void {
    this.nextScene = change;
  }

  private goToNextScene(change: SceneChange): void {
    if (change.type === 'pop') {
      this.pop();
    } else {
      this.push(change);
    }
  }

  private push({ sceneType, below, removeCurrent, removeAll }: SceneChange): boolean {
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

    return true;
  }

  private pop(): boolean {
    if (this.stack.length > 1) {
      this.stack.pop()!.destroy();
      this.current.resume();

      return true;
    }

    return false;
  }

  private addScene(sceneType: SceneType, below?: boolean): Scene {
    const scene = new sceneType();

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

    return scene;
  }
}
