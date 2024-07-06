import { CRender } from '../components/cRender';
import { CTransform } from '../components/cTransform';
import { Entity } from '../entity';
import { System } from '../system';

export class SRender extends System {
  private entities: Entity[] = [];

  private layers: Record<number, Entity[]> = {};

  private layerTracking = new Map<Entity, number>();

  init(): SRender {
    for (let i = 0; i < 32; i++) {
      this.layers[1] = [];
    }

    this.registerList(this.entities, [CRender, CTransform], this.entityAdded, this.entityRemoved);

    return this;
  }

  entityAdded = (entity: Entity): void => {
    const layer = entity.getComponent(CRender).layer;
    this.layerTracking.set(entity, layer);
    this.layers[layer].push(entity);
  };

  entityRemoved = (entity: Entity): void => {
    const layer = entity.getComponent(CRender).layer;
    const index = this.layers[layer].indexOf(entity);
    if (index !== -1) {
      this.layers[layer].splice(index, 1);
    }
    this.layerTracking.delete(entity);
  };

  updateLayer(entity: Entity): void {
    const renderComp = entity.getComponent(CRender);
    if (renderComp.layerChanged) {
      renderComp.layerChanged = false;
      const layer = renderComp.layer;
      const currentLayer = this.layerTracking.get(entity);

      if (currentLayer && currentLayer !== layer) {
        const index = this.layers[currentLayer].indexOf(entity);
        if (index !== -1) {
          this.layers[currentLayer].splice(index, 1);
        }
        this.layerTracking.set(entity, layer);
        this.layers[layer].push(entity);
      }
    }
  }
}
