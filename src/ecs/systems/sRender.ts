import { inject } from '../../di/inject.js';
import { Graphics } from '../../graphics/graphics.js';
import { removeByValue } from '../../utils/arrayUtils.js';
import { Camera } from '../../view/camera.js';
import { View } from '../../view/view.js';
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

    this.registerList({
      entities: this.entities,
      renderables: true,
      addCallback: this.entityAdded,
      removeCallback: this.entityRemoved,
    });
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

                for (const comp of entity.getRenderComponents()) {
                  comp.cRender(graphics);
                }

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
                  const transform = entity.getComponent(CTransform);
                  transform.updateMatrix();

                  graphics.pushTransform();
                  graphics.applyTransform(transform.matrix);

                  for (const comp of entity.getRenderComponents()) {
                    comp.cDebugRender(graphics);
                  }

                  graphics.popTransform();
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
    const layer = entity.layer;
    this.layerTracking.set(entity, layer);
    this.layers[layer].push(entity);
  };

  entityRemoved = (entity: Entity): void => {
    const layer = entity.layer;
    removeByValue(this.layers[layer], entity);
    this.layerTracking.delete(entity);
  };

  updateLayer(entity: Entity): void {
    if (entity.layerChanged) {
      entity.layerChanged = false;
      const layer = entity.layer;
      const currentLayer = this.layerTracking.get(entity);

      if (currentLayer && currentLayer !== layer) {
        removeByValue(this.layers[currentLayer], entity);
        this.layerTracking.set(entity, layer);
        this.layers[layer].push(entity);
      }
    }
  }
}
