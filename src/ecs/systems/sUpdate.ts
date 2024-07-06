import { CUpdate } from '../components/cUpdate';
import { Entity } from '../entity';
import { System } from '../system';

export class SUpdate extends System {
  private entities: Entity[] = [];

  init(): SUpdate {
    this.registerList(this.entities, [CUpdate]);
    this.active = true;

    return this;
  }

  update(dt: number): void {
    if (!this.active) {
      return;
    }

    for (const entity of this.entities) {
      entity.getComponent(CUpdate).update(dt);
    }
  }
}
