import { inject } from 'src/di/inject';
import { Entity } from 'src/ecs/entity';
import { EntityManager } from 'src/ecs/entityManager';
import { System, SystemType } from 'src/ecs/system';
import { SystemManager } from 'src/ecs/systemManager';
import { Graphics } from 'src/graphics/graphics';
import { TweenManager } from 'src/tweens/tweenManager';
import { Camera } from 'src/view/camera';
import { View } from 'src/view/view';

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

  addSystem<T extends System>(systemType: SystemType<T>): T {
    return this.systemManager.addSystem(systemType);
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
