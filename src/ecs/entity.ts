import {
  Component,
  ComponentClass,
  ComponentType,
  hasRenderable,
  hasUpdatable,
  Renderable,
  Updatable,
} from './component.js';

export class Entity {
  active = true;

  componentsUpdated = false;

  layerChanged = false;

  get id(): number {
    return this._id;
  }

  get layer(): number {
    return this._layer;
  }

  set layer(value: number) {
    this._layer = value;
    this.layerChanged = true;
  }

  private static nextId = 0;

  private static freeIds: number[] = [];

  private _id: number;

  private readonly components = new Map<ComponentClass<Component>, Component>();

  private updatetableComponents: Updatable[] = [];

  private renderableComponents: Renderable[] = [];

  private _layer = 0;

  constructor() {
    if (Entity.nextId > Number.MAX_SAFE_INTEGER) {
      this._id = Entity.freeIds.pop()!;
    } else {
      this._id = Entity.nextId;
      Entity.nextId++;
    }
  }

  addComponent<T extends ComponentType>(componentType: T, ...params: ConstructorParameters<T>): InstanceType<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    params[0].entityId = this.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    params[0].components = this.components;

    const component = new componentType(...params);
    this.components.set(componentType, component);
    this.componentsUpdated = true;

    if (hasUpdatable(component)) {
      this.updatetableComponents.push(component as unknown as Updatable);
    }

    if (hasRenderable(component)) {
      this.renderableComponents.push(component as unknown as Renderable);
    }

    return component as InstanceType<T>;
  }

  removeComponent(componentClass: typeof Component): boolean {
    let removed = false;
    if (this.components.has(componentClass)) {
      const component = this.components.get(componentClass)!;
      component.destroy();

      this.components.delete(componentClass);
      this.componentsUpdated = true;
      removed = true;

      let index = this.updatetableComponents.indexOf(component as unknown as Updatable);
      if (index !== -1) {
        this.updatetableComponents.splice(index, 1);
      }

      index = this.renderableComponents.indexOf(component as unknown as Renderable);
      if (index !== -1) {
        this.renderableComponents.splice(index, 1);
      }
    }

    return removed;
  }

  getComponent<T extends Component>(componentClass: ComponentClass<T>): T {
    return this.components.get(componentClass) as T;
  }

  hasComponent(componentClass: typeof Component): boolean {
    return this.components.has(componentClass);
  }

  hasComponents(componentClasses: (typeof Component)[]): boolean {
    for (const componentClass of componentClasses) {
      if (!this.components.has(componentClass)) {
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

  getRenderComponents(): Renderable[] {
    return this.renderableComponents;
  }

  getUpdateComponents(): Updatable[] {
    return this.updatetableComponents;
  }
}
