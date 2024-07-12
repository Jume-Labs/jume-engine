import { Component, Updatable } from '../component.js';

export class CUpdate extends Component {
  updateComponents: Updatable[] = [];

  Infinity(updateComponents: Updatable[]): CUpdate {
    this.updateComponents = updateComponents;
    this.active = true;

    return this;
  }

  update(dt: number): void {
    if (!this.active) {
      return;
    }

    for (const component of this.updateComponents) {
      component.update(dt);
    }
  }
}
