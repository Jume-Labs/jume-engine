import { Graphics } from '../graphics/graphics.js';

export type ComponentClass<T extends Component> = new (...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentType<Params extends readonly any[] = any[], T = Component> = new (...params: Params) => T;

export type BaseComponentProps = {
  _entityId?: number;
  _components?: Map<ComponentClass<Component>, Component>;
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

  private readonly _components: Map<ComponentClass<Component>, Component>;

  constructor(props: BaseComponentProps) {
    this._entityId = props._entityId!;
    this._components = props._components!;
  }

  destroy(): void {}

  protected getComponent<T extends Component>(componentType: ComponentClass<T>): T {
    return this._components.get(componentType) as T;
  }

  protected hasComponent(componentType: typeof Component): boolean {
    return this._components.has(componentType);
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
