import { Mat4 } from '../../math/mat4.js';
import { toRad } from '../../math/mathUtils.js';
import { Vec2 } from '../../math/vec2.js';
import { BaseComponentProps, Component } from '../component.js';

export type CTransformProps = BaseComponentProps & {
  x?: number;
  y?: number;
  rotation?: number;
  scaleX?: number;
  scaleXY?: number;
  parent?: CTransform;
};

export class CTransform extends Component {
  parent?: CTransform;

  position = new Vec2();

  scale = new Vec2();

  rotation = 0;

  matrix = new Mat4();

  private worldPosition = new Vec2();

  private worldRotation = 0;

  private worldScale = new Vec2();

  private tempScale = new Vec2();

  constructor(props: CTransformProps) {
    super(props);

    const { x, y, rotation, scaleX, scaleXY, parent } = props;

    this.position.set(x ?? 0, y ?? 0);
    this.rotation = rotation ?? 0;
    this.scale.set(scaleX ?? 1, scaleXY ?? 1);
    this.parent = parent;

    return this;
  }

  updateMatrix(): void {
    if (this.parent) {
      this.getWorldPosition(this.worldPosition);
      this.getWorldScale(this.worldScale);
      this.worldRotation = this.getWorldRotation();

      Mat4.from2dRotationTranslationScale(
        toRad(this.worldRotation),
        this.worldPosition.x,
        this.worldPosition.y,
        this.worldScale.x,
        this.worldScale.y,
        this.matrix
      );
    } else {
      Mat4.from2dRotationTranslationScale(
        toRad(this.rotation),
        this.position.x,
        this.position.y,
        this.scale.x,
        this.scale.y,
        this.matrix
      );
    }
  }

  parentToLocalPosition(pos: Vec2): Vec2 {
    if (this.rotation === 0) {
      if (this.scale.x === 1 && this.scale.y === 1) {
        pos.sub(this.position);
      } else {
        pos.x = (pos.x - this.position.x) / this.scale.x;
        pos.y = (pos.y - this.position.y) / this.scale.y;
      }
    } else {
      const rad = toRad(this.rotation);
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const toX = pos.x - this.position.x;
      const toY = pos.y - this.position.y;

      pos.x = (toX * cos + toY * sin) / this.scale.x;
      pos.y = (toX * -sin + toY * cos) / this.scale.y;
    }

    return pos;
  }

  localToParentPosition(pos: Vec2): Vec2 {
    if (this.rotation === 0) {
      if (this.scale.x === 1 && this.scale.y === 1) {
        pos.x += this.position.x;
        pos.y += this.position.y;
      } else {
        pos.x = pos.x * this.scale.x + this.position.x;
        pos.y = pos.y * this.scale.y + this.position.y;
      }
    } else {
      const rad = toRad(-this.rotation);
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const toX = pos.x * this.scale.x;
      const toY = pos.y * this.scale.y;
      pos.x = toX * cos + toY * sin + this.position.x;
      pos.y = toX * -sin + toY * cos + this.position.y;
    }

    return pos;
  }

  localToWorldPosition(pos: Vec2): Vec2 {
    let p = this.parent;
    while (p) {
      p.localToParentPosition(pos);
      p = p.parent;
    }

    return pos;
  }

  worldToLocalPosition(pos: Vec2): Vec2 {
    if (this.parent) {
      this.parentToLocalPosition(pos);
    }

    return pos;
  }

  getWorldPosition(out?: Vec2): Vec2 {
    if (!out) {
      out = Vec2.get();
    }

    out.copyFrom(this.position);

    return this.localToWorldPosition(out);
  }

  setWorldPosition(pos: Vec2): void {
    this.worldToLocalPosition(pos);

    this.position.copyFrom(pos);
  }

  getWorldRotation(): number {
    if (this.parent) {
      return this.parent.getWorldRotation() + this.rotation;
    }

    return this.rotation;
  }

  setWorldRotation(rotation: number): void {
    if (this.parent) {
      this.rotation = rotation - this.parent.getWorldRotation();
    } else {
      this.rotation = rotation;
    }
  }

  getWorldScale(out?: Vec2): Vec2 {
    if (!out) {
      out = Vec2.get();
    }

    out.copyFrom(this.scale);

    if (this.parent) {
      this.parent.getWorldScale(this.tempScale);
      out.mul(this.tempScale);
    }

    return out;
  }

  setWorldScale(scale: Vec2): void {
    // Convert to local scale.
    if (this.parent) {
      this.parent.getWorldScale(this.tempScale);
      scale.div(this.tempScale);
    }

    this.scale.copyFrom(scale);
  }
}
