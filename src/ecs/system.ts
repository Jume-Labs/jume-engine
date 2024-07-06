import { Graphics } from 'src/graphics/graphics';
import { Camera } from 'src/view/camera';

import { Component, ComponentType } from './component';
import { Entity } from './entity';

export type SystemType<T extends System> = new (systems: Map<SystemType<System>, System>, order: number) => T;

interface EntityList {
  entities: Entity[];
  components: ComponentType<Component>[];
  addCallback?: (entity: Entity) => void;
  removeCallback?: (entity: Entity) => void;
}

export class System {
  readonly order: number;

  active = false;

  private readonly lists: EntityList[] = [];

  private readonly systems: Map<SystemType<System>, System>;

  constructor(systems: Map<SystemType<System>, System>, order: number) {
    this.systems = systems;
    this.order = order;
  }

  update(_dt: number): void {}

  render(_graphics: Graphics, _cameras: Camera[]): void {}

  debugRender(_graphics: Graphics, _cameras: Camera[]): void {}

  updateEntityLists(entity: Entity, removed: boolean): void {
    for (const list of this.lists) {
      if (removed) {
        if (list.entities.includes(entity)) {
          const index = list.entities.indexOf(entity);
          if (index !== -1) {
            list.entities.splice(index, 1);
            if (list.removeCallback) {
              list.removeCallback(entity);
            }
          }
        }
      } else {
        if (!list.entities.includes(entity) && entity.hasComponents(list.components)) {
          list.entities.push(entity);
          if (list.addCallback) {
            list.addCallback(entity);
          }
        } else if (list.entities.includes(entity) && !entity.hasComponents(list.components)) {
          const index = list.entities.indexOf(entity);
          if (index !== -1) {
            list.entities.splice(index, 1);
            if (list.removeCallback) {
              list.removeCallback(entity);
            }
          }
        }
      }
    }
  }

  destroy(): void {}

  protected getSystem<T extends System>(systemType: SystemType<T>): T {
    return this.systems.get(systemType) as T;
  }

  protected hasSystem(systemType: SystemType<System>): boolean {
    return this.systems.has(systemType);
  }

  protected registerList(
    entities: Entity[],
    components: ComponentType<Component>[],
    addCallback?: (entity: Entity) => void,
    removeCallback?: (entity: Entity) => void
  ): void {
    this.lists.push({
      entities,
      components,
      addCallback,
      removeCallback,
    });
  }
}
