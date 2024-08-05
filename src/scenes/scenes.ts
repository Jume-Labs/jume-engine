import { Entities, EntityType } from '../ecs/entities.js';
import { Entity } from '../ecs/entity.js';
import { System, SystemConstructible } from '../ecs/system.js';
import { Systems } from '../ecs/systems.js';
import { Graphics } from '../graphics/graphics.js';
import { Tweens } from '../tweens/tweens.js';
import { Camera } from '../view/camera.js';

export type SceneType = new () => Scene;

export type SceneChangeType = 'push' | 'pop';

export type SceneChange = {
  sceneType: SceneType;
  type: SceneChangeType;
  removeCurrent?: boolean;
  below?: boolean;
  removeAll?: boolean;
};

export class Scene {
  isOverlay = false;

  pauseInOverlay = true;

  protected readonly cameras: Camera[];

  protected readonly entities: Entities;

  protected readonly systems: Systems;

  protected readonly tweens: Tweens;

  constructor() {
    this.cameras = [new Camera()];
    this.systems = new Systems(this.cameras);
    this.entities = new Entities(this.systems);
    this.tweens = new Tweens();
  }

  addEntity<T extends EntityType>(entityType: T, ...params: ConstructorParameters<T>): InstanceType<T> {
    return this.entities.add(entityType, ...params);
  }

  removeEntity(entity: Entity): boolean {
    return this.entities.remove(entity);
  }

  removeEntityId(id: number): boolean {
    return this.entities.removeById(id);
  }

  getEntityById(id: number): Entity | undefined {
    return this.entities.getById(id);
  }

  addSystem<T extends SystemConstructible>(
    systemType: T,
    order: number,
    ...params: ConstructorParameters<T>
  ): InstanceType<T> {
    return this.systems.add(systemType, order, ...params);
  }

  removeSystem(systemType: typeof System): boolean {
    return this.systems.remove(systemType);
  }

  update(dt: number): void {
    this.tweens.update(dt);
    this.entities.update();
    this.systems.update(dt);
  }

  render(graphics: Graphics): void {
    this.systems.render(graphics);
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
    this.entities.destroy();
    this.systems.destroy();
  }
}

export class Scenes {
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

    if (!this.current) {
      return;
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
    if (!this.current) {
      return;
    }

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
