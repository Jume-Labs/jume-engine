import { BaseComponentProps, Component, Updatable } from '../component.js';

export interface CUpdateProps {
  updateComponents: Updatable[];
}
export class CUpdate extends Component {
  updateComponents: Updatable[] = [];

  constructor(base: BaseComponentProps, props: CUpdateProps) {
    super(base);
    this.updateComponents = props.updateComponents;
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
