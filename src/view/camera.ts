import { inject } from 'src/di/inject';
import { Color } from 'src/graphics/color';
import { RenderTarget } from 'src/graphics/renderTarget';
import { Mat4 } from 'src/math/mat4';
import { clamp, rotateAround, toRad } from 'src/math/mathUtils';
import { Rectangle } from 'src/math/rectangle';
import { Vec2 } from 'src/math/vec2';

import { View } from './view';

export class Camera {
  active = true;

  position = new Vec2();

  rotation = 0;

  zoom = 1;

  transform: Mat4;

  bgColor = new Color();

  ignoredLayers: number[] = [];

  readonly bounds = new Rectangle();

  readonly screenBounds = new Rectangle();

  target!: RenderTarget;

  private viewRect = new Rectangle();

  private tempMatrix = new Mat4();

  @inject
  private view!: View;

  constructor(options?: CameraOptions) {
    this.transform = new Mat4();

    if (options) {
      const { x, y, rotation, zoom, viewX, viewY, viewWidth, viewHeight, bgColor, ignoredLayers } = options;

      this.position.set(x ?? this.view.viewCenterX, y ?? this.view.viewCenterY);
      this.rotation = rotation ?? 0;
      this.zoom = zoom ?? 1;
      this.bgColor = bgColor ?? Color.BLACK.clone();
      this.ignoredLayers = ignoredLayers ?? [];
      this.updateView(viewX ?? 0, viewY ?? 0, viewWidth ?? 1, viewHeight ?? 1);
    } else {
      this.position.set(this.view.viewCenterX, this.view.viewCenterY);
      this.updateView(0, 0, 1, 1);
    }
    this.updateBounds();
  }

  updateTransform(): void {
    this.updateBounds();
    Mat4.fromTranslation(this.screenBounds.width * 0.5, this.screenBounds.height * 0.5, 0, this.transform);
    Mat4.fromZRotation(toRad(this.rotation), this.tempMatrix);
    Mat4.multiply(this.transform, this.tempMatrix, this.transform);

    Mat4.fromScale(this.zoom, this.zoom, 1, this.tempMatrix);
    Mat4.multiply(this.transform, this.tempMatrix, this.transform);

    Mat4.fromTranslation(-this.position.x, -this.position.y, 0, this.tempMatrix);
    Mat4.multiply(this.transform, this.tempMatrix, this.transform);
  }

  updateView(x: number, y: number, width: number, height: number): void {
    x = clamp(x, 0, 1);
    y = clamp(y, 0, 1);
    width = clamp(width, 0, 1);
    height = clamp(height, 0, 1);
    this.viewRect.set(x, y, width, height);

    this.screenBounds.set(
      x * this.view.viewWidth,
      y * this.view.viewHeight,
      width * this.view.viewWidth,
      height * this.view.viewHeight
    );
    this.target = new RenderTarget(width * this.view.viewWidth, height * this.view.viewHeight);
  }

  updateBounds(): void {
    this.bounds.x = this.position.x - (this.screenBounds.width * 0.5) / this.zoom;
    this.bounds.y = this.position.y - (this.screenBounds.height * 0.5) / this.zoom;
    this.bounds.width = this.screenBounds.width / this.zoom;
    this.bounds.height = this.screenBounds.height / this.zoom;
  }

  resize(): void {
    this.updateView(this.viewRect.x, this.viewRect.y, this.viewRect.width, this.viewRect.height);
    this.updateBounds();
  }

  screenToWorld(x: number, y: number, out?: Vec2): Vec2 {
    const tempX =
      this.position.x -
      (this.screenBounds.width * 0.5) / this.zoom +
      (x / (this.view.canvasWidth / this.view.pixelRatio)) * (this.screenBounds.width / this.zoom);

    const tempY =
      this.position.y -
      (this.screenBounds.height * 0.5) / this.zoom +
      (y / (this.view.canvasHeight / this.view.pixelRatio)) * (this.screenBounds.height / this.zoom);

    return rotateAround(tempX, tempY, this.position.x, this.position.y, -this.rotation, out);
  }

  screenToView(x: number, y: number, out?: Vec2): Vec2 {
    if (!out) {
      out = Vec2.get();
    }

    out.set(
      (x / (this.view.canvasWidth / this.view.pixelRatio)) * this.view.viewWidth,
      (y / (this.view.canvasHeight / this.view.pixelRatio)) * this.view.viewHeight
    );

    return out;
  }
}

export interface CameraOptions {
  x?: number;

  y?: number;

  rotation?: number;

  zoom?: number;

  viewX?: number;

  viewY?: number;

  viewWidth?: number;

  viewHeight?: number;

  bgColor?: Color;

  ignoredLayers?: number[];
}
