import { Component, ComponentType } from './component.js';

export class Entity {
  active = true;

  componentsUpdated = false;

  get id(): number {
    return this._id;
  }

  private static nextId = 0;

  private static freeIds: number[] = [];

  private _id: number;

  private readonly components = new Map<ComponentType<Component>, Component>();

  constructor() {
    if (Entity.nextId > Number.MAX_SAFE_INTEGER) {
      this._id = Entity.freeIds.pop()!;
    } else {
      this._id = Entity.nextId;
      Entity.nextId++;
    }
  }

  addComponent<T extends Component, P = unknown>(componentType: ComponentType<T>, props: P): T {
    const base = {
      entityId: this.id,
      components: this.components,
    };

    const component = new componentType(base, props);
    this.components.set(componentType, component);
    this.componentsUpdated = true;

    return component;
  }

  removeComponent(componentType: typeof Component): boolean {
    let removed = false;
    if (this.components.has(componentType)) {
      const component = this.components.get(componentType)!;
      component.destroy();

      this.components.delete(componentType);
      this.componentsUpdated = true;
      removed = true;
    }

    return removed;
  }

  getComponent<T extends Component>(componentType: ComponentType<T>): T {
    return this.components.get(componentType) as T;
  }

  hasComponent(componentType: typeof Component): boolean {
    return this.components.has(componentType);
  }

  hasComponents(componentTypes: (typeof Component)[]): boolean {
    for (const componentType of componentTypes) {
      if (!this.components.has(componentType)) {
        return false;
      }
    }

    return true;
  }

  destroy(): void {
    Entity.freeIds.push(this._id);

    for (const [key, component] of this.components) {
      component.destroy();
      this.components.delete(key);
    }
  }
}
