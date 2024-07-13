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

export class Scene {
  isOverlay = false;

  pauseInOverlay = true;

  private readonly cameras: Camera[];

  private readonly entityManager: EntityManager;

  private readonly systemManager: SystemManager;

  private readonly tweenManager: TweenManager;

  @inject
  private view!: View;

  constructor() {
    this.cameras = [new Camera()];
    this.systemManager = new SystemManager(this.view, this.cameras);
    this.entityManager = new EntityManager(this.systemManager);
    this.tweenManager = new TweenManager();
  }

  init(): void {}

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
