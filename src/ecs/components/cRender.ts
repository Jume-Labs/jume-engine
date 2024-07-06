import { Graphics } from 'src/graphics/graphics';

import { Component, Renderable } from '../component';

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

  Infinity(renderComponents: Renderable[], layer = 0): CRender {
    this.layer = layer;
    this.renderComponents = renderComponents;
    this.active = true;

    return this;
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
