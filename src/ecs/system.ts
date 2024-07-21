import { Graphics } from '../graphics/graphics.js';
import { removeByValue } from '../utils/arrayUtils.js';
import { Camera } from '../view/camera.js';
import { Component, ComponentType } from './component.js';
import { Entity } from './entity.js';

export type SystemType<T extends System> = new (...args: any[]) => T;

export interface BaseSystemProps {
  systems: Map<SystemType<System>, System>;
  order: number;
}

interface EntityList {
  entities: Entity[];
  components?: ComponentType<Component>[];
  updatables?: boolean;
  renderables?: boolean;
  addCallback?: (entity: Entity) => void;
  removeCallback?: (entity: Entity) => void;
}

export class System {
  readonly order: number;

  active = true;

  debug = true;

  private readonly lists: EntityList[] = [];

  private readonly systems: Map<SystemType<System>, System>;

  constructor(base: BaseSystemProps, _props?: unknown) {
    this.systems = base.systems;
    this.order = base.order;
  }

  update(_dt: number): void {}

  render(_graphics: Graphics, _cameras: Camera[]): void {}

  debugRender(_graphics: Graphics, _cameras: Camera[]): void {}

  updateEntityLists(entity: Entity, removed: boolean): void {
    for (const list of this.lists) {
      if (removed) {
        if (list.entities.includes(entity)) {
          if (removeByValue(list.entities, entity)) {
            if (list.removeCallback) {
              list.removeCallback(entity);
            }
          }
        }
      } else {
        if (!list.entities.includes(entity) && this.hasAny(entity, list)) {
          list.entities.push(entity);
          if (list.addCallback) {
            list.addCallback(entity);
          }
        } else if (list.entities.includes(entity) && !this.hasAny(entity, list)) {
          if (removeByValue(list.entities, entity)) {
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

  protected registerList({
    entities,
    components,
    updatables,
    renderables,
    addCallback,
    removeCallback,
  }: EntityList): void {
    this.lists.push({
      entities,
      components,
      updatables,
      renderables,
      addCallback,
      removeCallback,
    });
  }

  private hasAny(entity: Entity, list: EntityList): boolean {
    if (list.components) {
      return entity.hasComponents(list.components);
    } else if (list.renderables && entity.getRenderComponents().length > 0) {
      return true;
    } else if (list.updatables && entity.getUpdateComponents().length > 0) {
      return true;
    }

    return false;
  }
}
