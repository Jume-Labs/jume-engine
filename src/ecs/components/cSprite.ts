import { Atlas, AtlasFrame } from '../../graphics/atlas.js';
import { Color } from '../../graphics/color.js';
import { Graphics } from '../../graphics/graphics.js';
import { Vec2 } from '../../math/vec2.js';
import { Component, Renderable } from '../component.js';

export interface CSpriteOptions {
  atlas: Atlas;
  frameName: string;
  anchor?: { x: number; y: number };
  tint?: Color;
  flipX?: boolean;
  flipY?: boolean;
}

export class CSprite extends Component implements Renderable {
  anchor = new Vec2(0.5, 0.5);

  tint = new Color(1, 1, 1);

  flipX = false;

  flipY = false;

  get atlas(): Atlas | undefined {
    return this._atlas;
  }

  get frameName(): string {
    return this.frame?.name ?? '';
  }

  get width(): number {
    return this.frame?.sourceSize.width ?? 0;
  }

  get height(): number {
    return this.frame?.sourceSize.height ?? 0;
  }

  private _atlas?: Atlas;

  private frame?: AtlasFrame;

  init(options: CSpriteOptions): CSprite {
    if (options.anchor) {
      this.anchor.set(options.anchor.x, options.anchor.y);
    }

    this.flipX = options.flipX ?? false;
    this.flipY = options.flipY ?? false;
    if (options.tint) {
      this.tint.copyFrom(options.tint);
    }
    this.setFrame(options.frameName, options.atlas);

    this.active = true;

    return this;
  }

  setFrame(frameName: string, atlas?: Atlas): void {
    if (atlas) {
      this._atlas = atlas;
    }

    this.frame = this.atlas?.getFrame(frameName);
  }

  render(graphics: Graphics): void {
    if (!this._atlas || !this.frame) {
      return;
    }

    const frame = this.frame;

    graphics.color.copyFrom(this.tint);
    graphics.drawImageSection(
      -(frame.sourceSize.width * this.anchor.x) + frame.sourceRect.x,
      -(frame.sourceSize.height * this.anchor.y) + frame.sourceRect.y,
      frame.frame.x,
      frame.frame.y,
      frame.frame.width,
      frame.frame.height,
      this._atlas.image,
      this.flipX,
      this.flipY
    );
  }

  debugRender(_graphics: Graphics): void {}
}
