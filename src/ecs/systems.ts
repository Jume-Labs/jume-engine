import { inject } from '../di/inject.js';
import { Graphics } from '../graphics/graphics.js';
import { removeByValue } from '../utils/arrayUtils.js';
import { Camera } from '../view/camera.js';
import { View } from '../view/view.js';
import { Entity } from './entity.js';
import { System, SystemConstructible, SystemType } from './system.js';

export class Systems {
  private systems = new Map<SystemType<System>, System>();

  private systemList: System[] = [];

  private cameras: Camera[];

  @inject
  private view!: View;

  constructor(cameras: Camera[]) {
    this.cameras = cameras;
  }

  add<T extends SystemConstructible>(
    systemType: T,
    order: number,
    ...params: ConstructorParameters<T>
  ): InstanceType<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    params[0]._systems = this.systems;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    params[0]._order = order;

    const system = new systemType(...params);
    this.systems.set(systemType, system);

    this.systemList.push(system);
    this.systemList.sort((a, b) => {
      if (a.order > b.order) {
        return -1;
      } else if (a.order < b.order) {
        return 1;
      }

      return 0;
    });

    return system as InstanceType<T>;
  }

  remove(systemType: typeof System): boolean {
    let removed = false;
    if (this.systems.has(systemType)) {
      const system = this.systems.get(systemType)!;
      system.destroy();

      this.systems.delete(systemType);

      removeByValue(this.systemList, system);
      removed = true;
    }

    return removed;
  }

  get<T extends System>(systemType: SystemType<T>): T {
    return this.systems.get(systemType) as T;
  }

  update(dt: number): void {
    for (const system of this.systemList) {
      if (system.active) {
        system.update(dt);
      }
    }
  }

  render(graphics: Graphics): void {
    for (const system of this.systemList) {
      if (system.active) {
        system.render(graphics, this.cameras);
      }
    }

    if (this.view.debugRender) {
      for (const system of this.systemList) {
        if (system.active && system.debug) {
          system.debugRender(graphics, this.cameras);
        }
      }
    }

    graphics.transform.identity();
    graphics.color.set(1, 1, 1, 1);

    graphics.start();
    // Render all cameras to the main target.
    for (const camera of this.cameras) {
      graphics.drawRenderTarget(camera.screenBounds.x, camera.screenBounds.y, camera.target);
    }
    graphics.present();
  }

  updateSystemEntities(entity: Entity, removed = false): void {
    for (const system of this.systemList) {
      system.updateEntityLists(entity, removed);
    }
  }

  destroy(): void {
    for (const system of this.systemList) {
      system.destroy();
    }
  }
}
