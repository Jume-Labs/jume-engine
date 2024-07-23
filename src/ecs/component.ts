import { Graphics } from '../graphics/graphics.js';

export type ComponentType<T extends Component> = new (...args: any[]) => T;

export type BaseComponentProps = {
  entityId: number;
  components: Map<ComponentType<Component>, Component>;
};

export interface Renderable {
  cRender(graphics: Graphics): void;
  cDebugRender?(graphics: Graphics): void;
}

export interface Updatable {
  cUpdate(dt: number): void;
}

export function hasRenderable(component: Component): boolean {
  return 'cRender' in component;
}

export function hasUpdatable(component: Component): boolean {
  return 'cUpdate' in component;
}

export class Component {
  active = true;

  get entityId(): number {
    return this._entityId;
  }

  private _entityId: number;

  private readonly components: Map<ComponentType<Component>, Component>;

  constructor(base: BaseComponentProps, _props?: unknown) {
    this._entityId = base.entityId;
    this.components = base.components;
  }

  destroy(): void {}

  protected getComponent<T extends Component>(componentType: ComponentType<T>): T {
    return this.components.get(componentType) as T;
  }

  protected hasComponent(componentType: typeof Component): boolean {
    return this.components.has(componentType);
  }

  protected hasComponents(componentTypes: (typeof Component)[]): boolean {
    for (const componentType of componentTypes) {
      if (!this.hasComponent(componentType)) {
        return false;
      }
    }

    return true;
  }
}
