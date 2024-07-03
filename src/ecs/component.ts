import { Graphics } from 'src/graphics/graphics';

export type ComponentType<T extends Component> = new (
  entityId: number,
  components: Map<ComponentType<Component>, Component>
) => T;

export interface Renderable {
  render(graphics: Graphics): void;
  debugRender(graphics: Graphics): void;
}

export interface Updatable {
  update(dt: number): void;
}

export class Component {
  active = false;

  get entityId(): number {
    return this._entityId;
  }

  private _entityId: number;

  private readonly components: Map<ComponentType<Component>, Component>;

  constructor(entityId: number, components: Map<ComponentType<Component>, Component>) {
    this._entityId = entityId;
    this.components = components;
  }

  destroy(): void {}

  protected getComponent<T extends Component>(componentType: ComponentType<T>): T | undefined {
    return this.components.get(componentType) as T | undefined;
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
