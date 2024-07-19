import { Graphics } from '../graphics/graphics.js';
import { removeByValue } from '../utils/arrayUtils.js';
import { Camera } from '../view/camera.js';
import { View } from '../view/view.js';
import { Entity } from './entity.js';
import { BaseSystemProps, System, SystemType } from './system.js';

export class SystemManager {
  private systems = new Map<SystemType<System>, System>();

  private systemList: System[] = [];

  private cameras: Camera[];

  private view: View;

  constructor(view: View, cameras: Camera[]) {
    this.view = view;
    this.cameras = cameras;
  }

  addSystem<T extends System, P = unknown>(systemType: SystemType<T>, props: P, order = 0): T {
    const base: BaseSystemProps = {
      systems: this.systems,
      order,
    };
    const system = new systemType(base, props);
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

    return system;
  }

  removeSystem(systemType: typeof System): boolean {
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

  getSystem<T extends System>(systemType: SystemType<T>): T {
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

    if (!this.view.debugRender) {
      return;
    }

    for (const system of this.systemList) {
      if (system.active && system.debug) {
        system.debugRender(graphics, this.cameras);
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
