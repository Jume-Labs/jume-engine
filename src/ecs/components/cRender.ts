import { Graphics } from '../../graphics/graphics.js';
import { BaseComponentProps, Component, Renderable } from '../component.js';

export interface CRenderProps {
  renderComponents: Renderable[];
  layer?: number;
}

export class CRender extends Component {
  layerChanged = false;

  renderComponents: Renderable[] = [];

  get layer(): number {
    return this._layer;
  }

  set layer(value: number) {
    this.layerChanged = true;
    this._layer = value;
  }

  constructor(base: BaseComponentProps, props: CRenderProps) {
    super(base);

    const { renderComponents, layer } = props;
    this.renderComponents = renderComponents;
    this._layer = layer ?? 0;
    this.active = true;
  }

  render(graphics: Graphics): void {
    if (!this.active) {
      return;
    }

    for (const component of this.renderComponents) {
      component.render(graphics);
    }
  }

  debugRender(graphics: Graphics): void {
    if (!this.active) {
      return;
    }

    for (const component of this.renderComponents) {
      component.debugRender(graphics);
    }
  }

  private _layer = -1;
}
