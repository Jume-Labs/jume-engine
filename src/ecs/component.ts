import { Graphics } from '../graphics/graphics.js';

export type ComponentType<T extends Component> = new (...args: any[]) => T;

export interface Renderable {
  render(graphics: Graphics): void;
  debugRender(graphics: Graphics): void;
}

export interface Updatable {
  update(dt: number): void;
}

export interface BaseComponentProps {
  entityId: number;
  components: Map<ComponentType<Component>, Component>;
}

export class Component {
  active = false;

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
