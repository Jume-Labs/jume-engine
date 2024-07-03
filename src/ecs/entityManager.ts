import { Entity } from './entity';
import { SystemManager } from './systemManager';

export class EntityManager {
  private readonly entities: Entity[] = [];

  private readonly entitiesToRemove: Entity[] = [];

  private readonly systemManager: SystemManager;

  constructor(systemManager: SystemManager) {
    this.systemManager = systemManager;
  }

  update(): void {
    while (this.entitiesToRemove.length > 0) {
      const entity = this.entitiesToRemove.pop()!;
      this.systemManager.updateSystemEntities(entity, true);

      entity.destroy();
      const index = this.entities.indexOf(entity);
      if (index !== -1) {
        this.entities.splice(index, 1);
      }
    }

    for (const entity of this.entities) {
      if (entity.componentsUpdated) {
        this.systemManager.updateSystemEntities(entity);
        entity.componentsUpdated = false;
      }
    }
  }

  add(entity: Entity): void {
    this.entities.push(entity);
    this.systemManager.updateSystemEntities(entity);
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
