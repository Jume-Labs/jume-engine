import { inject } from '../../di/inject.js';
import { Graphics } from '../../graphics/graphics.js';
import { removeByValue } from '../../utils/arrayUtils.js';
import { Camera } from '../../view/camera.js';
import { View } from '../../view/view.js';
import { CRender } from '../components/cRender.js';
import { CTransform } from '../components/cTransform.js';
import { Entity } from '../entity.js';
import { BaseSystemProps, System } from '../system.js';

export class SRender extends System {
  private entities: Entity[] = [];

  private layers: Record<number, Entity[]> = {};

  private layerTracking = new Map<Entity, number>();

  @inject
  private view!: View;

  constructor(base: BaseSystemProps) {
    super(base);

    for (let i = 0; i < 32; i++) {
      this.layers[i] = [];
    }

    this.registerList(this.entities, [CRender, CTransform], this.entityAdded, this.entityRemoved);
    this.active = true;

    return this;
  }

  override render(graphics: Graphics, cameras: Camera[]): void {
    for (const entity of this.entities) {
      if (entity.active) {
        this.updateLayer(entity);
      }
    }

    // Render all entities with each camera.
    for (const camera of cameras) {
      if (camera.active) {
        camera.updateTransform();

        // Use the camera render target and clear it.
        graphics.pushTarget(camera.target);
        graphics.start(true, camera.bgColor);

        // Apply the camera transform to render the entities in the correct place.
        graphics.pushTransform();
        graphics.applyTransform(camera.transform);

        // Render the entities in all layers.
        for (const key in this.layers) {
          const entities = this.layers[key];
          if (entities.length > 0 && !camera.ignoredLayers.includes(parseInt(key))) {
            for (const entity of entities) {
              if (entity.active) {
                const transform = entity.getComponent(CTransform);
                transform.updateMatrix();

                graphics.pushTransform();
                graphics.applyTransform(transform.matrix);

                entity.getComponent(CRender).render(graphics);

                graphics.popTransform();
              }
            }
          }
        }

        if (this.view.debugRender) {
          // Debug Render the entities in all layers.
          for (const key in this.layers) {
            const entities = this.layers[key];
            if (entities.length > 0 && !camera.ignoredLayers.includes(parseInt(key))) {
              for (const entity of entities) {
                if (entity.active) {
                  entity.getComponent(CRender).debugRender(graphics);
                }
              }
            }
          }
        }

        graphics.popTransform();
        graphics.present();
        graphics.popTarget();
      }
    }
  }

  entityAdded = (entity: Entity): void => {
    const layer = entity.getComponent(CRender).layer;
    this.layerTracking.set(entity, layer);
    this.layers[layer].push(entity);
  };

  entityRemoved = (entity: Entity): void => {
    const layer = entity.getComponent(CRender).layer;
    removeByValue(this.layers[layer], entity);
    this.layerTracking.delete(entity);
  };

  updateLayer(entity: Entity): void {
    const renderComp = entity.getComponent(CRender);
    if (renderComp.layerChanged) {
      renderComp.layerChanged = false;
      const layer = renderComp.layer;
      const currentLayer = this.layerTracking.get(entity);

      if (currentLayer && currentLayer !== layer) {
        removeByValue(this.layers[currentLayer], entity);
        this.layerTracking.set(entity, layer);
        this.layers[layer].push(entity);
      }
    }
  }
}
