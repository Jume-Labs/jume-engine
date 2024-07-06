import { Graphics } from 'src/graphics/graphics';
import { Camera } from 'src/view/camera';

import { Entity } from './entity';
import { System, SystemType } from './system';

export class SystemManager {
  private systems = new Map<SystemType<System>, System>();

  private systemList: System[] = [];

  private cameras: Camera[];

  constructor(cameras: Camera[]) {
    this.cameras = cameras;
  }

  addSystem<T extends System>(systemType: SystemType<T>, order = 0): T {
    const system = new systemType(this.systems, order);
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

      const index = this.systemList.indexOf(system);
      if (index !== -1) {
        this.systemList.splice(index, 1);
      }
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

    for (const system of this.systemList) {
      if (system.active) {
        system.debugRender(graphics, this.cameras);
      }
    }
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
