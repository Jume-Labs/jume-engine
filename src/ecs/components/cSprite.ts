import { Atlas, AtlasFrame } from '../../graphics/atlas.js';
import { Color } from '../../graphics/color.js';
import { Graphics } from '../../graphics/graphics.js';
import { Vec2 } from '../../math/vec2.js';
import { BaseComponentProps, Component, Renderable } from '../component.js';

export type CSpriteProps = {
  atlas: Atlas;
  frameName: string;
  anchor?: { x: number; y: number };
  tint?: Color;
  flipX?: boolean;
  flipY?: boolean;
};

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

  constructor(base: BaseComponentProps, props: CSpriteProps) {
    super(base);
    if (props.anchor) {
      this.anchor.set(props.anchor.x, props.anchor.y);
    }

    this.flipX = props.flipX ?? false;
    this.flipY = props.flipY ?? false;
    if (props.tint) {
      this.tint.copyFrom(props.tint);
    }
    this.setFrame(props.frameName, props.atlas);

    this.active = true;

    return this;
  }

  setFrame(frameName: string, atlas?: Atlas): void {
    if (atlas) {
      this._atlas = atlas;
    }

    this.frame = this.atlas?.getFrame(frameName);
  }

  cRender(graphics: Graphics): void {
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

  cDebugRender(_graphics: Graphics): void {}
}
