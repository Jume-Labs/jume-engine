import { removeByValue } from '../utils/arrayUtils.js';
import { Entity } from './entity.js';
import { Systems } from './systems.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EntityType<Params extends readonly unknown[] = any[], T = Entity> = new (...params: Params) => T;

export class Entities {
  private readonly entities: Entity[] = [];

  private readonly entitiesToRemove: Entity[] = [];

  private readonly systems: Systems;

  constructor(systems: Systems) {
    this.systems = systems;
  }

  update(): void {
    while (this.entitiesToRemove.length > 0) {
      const entity = this.entitiesToRemove.pop()!;
      this.systems.updateSystemEntities(entity, true);

      entity.destroy();
      removeByValue(this.entities, entity);
    }

    for (const entity of this.entities) {
      if (entity.componentsUpdated) {
        this.systems.updateSystemEntities(entity);
        entity.componentsUpdated = false;
      }
    }
  }

  add<T extends EntityType>(entityType: T, ...params: ConstructorParameters<T>): InstanceType<T> {
    const entity = new entityType(...params);
    this.entities.push(entity);
    this.systems.updateSystemEntities(entity);

    return entity as InstanceType<T>;
  }

  remove(entity: Entity): boolean {
    this.entitiesToRemove.push(entity);

    return true;
  }

  getById(id: number): Entity | undefined {
    return this.entities.find((entity) => entity.id === id);
  }

  removeById(id: number): boolean {
    const entity = this.getById(id);
    if (entity) {
      return this.remove(entity);
    }

    return false;
  }

  destroy(): void {
    for (const entity of this.entities) {
      entity.destroy();
    }
  }
}
