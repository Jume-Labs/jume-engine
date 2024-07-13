import { CUpdate } from '../components/cUpdate.js';
import { Entity } from '../entity.js';
import { BaseSystemProps, System } from '../system.js';

export class SUpdate extends System {
  private entities: Entity[] = [];

  constructor(base: BaseSystemProps) {
    super(base);

    this.registerList(this.entities, [CUpdate]);
    this.active = true;

    return this;
  }

  override update(dt: number): void {
    if (!this.active) {
      return;
    }

    for (const entity of this.entities) {
      entity.getComponent(CUpdate).update(dt);
    }
  }
}
