import {
  BaseComponentProps,
  Component,
  CTransform,
  inject,
  Random,
  Rectangle,
  Updatable,
  Vec2,
  View,
} from '@jume-labs/jume-engine';

export class CBunnyMove extends Component implements Updatable {
  private transform: CTransform;

  private speed = new Vec2();

  private rotationSpeed = 0;

  private bounds = new Rectangle();

  readonly gravity = 0.5;

  @inject
  private view!: View;

  @inject
  private random!: Random;

  constructor(base: BaseComponentProps) {
    super(base);

    this.transform = this.getComponent(CTransform);
    this.bounds.set(0, 0, this.view.viewWidth, this.view.viewHeight);

    this.speed.set(this.random.float(0.2, 5), this.random.float(0, 5) - 2.5);
    this.rotationSpeed = this.random.float(-4, 4);
  }

  cUpdate(_dt: number): void {
    this.transform.position.x += this.speed.x;
    this.transform.position.y += this.speed.y;
    this.transform.rotation += this.rotationSpeed;

    this.speed.y += this.gravity;

    if (this.transform.position.x > this.bounds.width) {
      this.transform.position.x = this.bounds.width;
      this.speed.x *= -1;
    } else if (this.transform.position.x < this.bounds.x) {
      this.transform.position.x = this.bounds.x;
      this.speed.x *= -1;
    }

    if (this.transform.position.y > this.bounds.height) {
      this.transform.position.y > this.bounds.height;

      this.speed.y *= -0.8;

      if (this.random.float() > 0.5) {
        this.speed.y -= 3 + this.random.float(0, 4);
      }
    } else if (this.transform.position.y < this.bounds.y) {
      this.transform.position.y = this.bounds.y;
      this.speed.y = 0;
    }
  }
}
