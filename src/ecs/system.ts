import { Graphics } from '../graphics/graphics.js';
import { removeByValue } from '../utils/arrayUtils.js';
import { Camera } from '../view/camera.js';
import { Component, ComponentClass } from './component.js';
import { Entity } from './entity.js';

export type SystemType<T extends System> = new (...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SystemConstructible<Params extends readonly any[] = any[], T = System> = new (...params: Params) => T;

export type BaseSystemProps = {
  _systems?: Map<SystemType<System>, System>;
  _order?: number;
};

type EntityList = {
  entities: Entity[];
  components?: ComponentClass<Component>[];
  updatables?: boolean;
  renderables?: boolean;
  addCallback?: (entity: Entity) => void;
  removeCallback?: (entity: Entity) => void;
};

export class System {
  readonly order: number;

  active = true;

  debug = true;

  private readonly lists: EntityList[] = [];

  private readonly _systems: Map<SystemType<System>, System>;

  constructor(props: BaseSystemProps) {
    this._systems = props._systems!;
    this.order = props._order!;
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
    return this._systems.get(systemType) as T;
  }

  protected hasSystem(systemType: SystemType<System>): boolean {
    return this._systems.has(systemType);
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
