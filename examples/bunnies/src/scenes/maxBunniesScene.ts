import {
  Assets,
  BitmapFont,
  Color,
  Events,
  Graphics,
  Image,
  inject,
  MouseEvent,
  Random,
  Rectangle,
  Scene,
  TimeStep,
  View,
} from '@jume-labs/jume-engine';

interface Bunny {
  x: number;
  y: number;
  rotation: number;
  xSpeed: number;
  ySpeed: number;
  rotationSpeed: number;
  color: Color;
}

export class MaxBunniesScene extends Scene {
  private bunnies: Bunny[] = [];

  private font: BitmapFont;

  private bunnyImage: Image;

  private bounds: Rectangle;

  private gravity = 0.5;

  private addingBunnies = false;

  @inject
  private assets!: Assets;

  @inject
  private events!: Events;

  @inject
  private random!: Random;

  @inject
  private timeStep!: TimeStep;

  @inject
  private view!: View;

  constructor() {
    super();

    this.font = this.assets.get(BitmapFont, 'font');
    this.bunnyImage = this.assets.get(Image, 'bunny');

    this.bounds = new Rectangle(0, 0, this.view.viewWidth, this.view.viewHeight);

    this.events.add(MouseEvent.MOUSE_DOWN, this.mouseDown);
    this.events.add(MouseEvent.MOUSE_UP, this.mouseUp);

    this.createBunny();
  }

  override update(_dt: number): void {
    for (const bunny of this.bunnies) {
      bunny.x += bunny.xSpeed;
      bunny.y += bunny.ySpeed;
      bunny.rotation += bunny.rotationSpeed;
      bunny.ySpeed += this.gravity;

      if (bunny.x > this.bounds.width) {
        bunny.x = this.bounds.width;
        bunny.xSpeed *= -1;
      } else if (bunny.x < this.bounds.x) {
        bunny.x = this.bounds.x;
        bunny.xSpeed *= -1;
      }

      if (bunny.y > this.bounds.height) {
        bunny.y = this.bounds.height;
        bunny.ySpeed *= -0.8;

        if (this.random.float(0, 1) > 0.5) {
          bunny.ySpeed -= 3 + this.random.float(0, 4);
        }
      } else if (bunny.y < this.bounds.y) {
        bunny.y = this.bounds.y;
        bunny.ySpeed = 0;
      }
    }

    if (this.addingBunnies) {
      for (let i = 0; i < 20; i++) {
        this.createBunny();
      }
    }
  }

  override render(graphics: Graphics): void {
    graphics.start(true);
    for (const bunny of this.bunnies) {
      graphics.color.copyFrom(bunny.color);
      graphics.drawImage(
        bunny.x - this.bunnyImage.width * 0.5,
        bunny.y - this.bunnyImage.height * 0.5,
        this.bunnyImage
      );
    }
    graphics.color.set(1, 1, 1, 1);

    graphics.drawBitmapText(16, 16, this.font, `FPS: ${this.timeStep.fps}`);
    graphics.drawBitmapText(16, 48, this.font, `Bunnies: ${this.bunnies.length}`);

    graphics.present();
  }

  private mouseDown = (_event: MouseEvent): void => {
    this.addingBunnies = true;
  };

  private mouseUp = (_event: MouseEvent): void => {
    this.addingBunnies = false;
  };

  private createBunny(): void {
    const bunny: Bunny = {
      x: 0,
      y: 0,
      rotation: 0,
      xSpeed: this.random.float(0.2, 5),
      ySpeed: this.random.float(0, 5) - 2.5,
      rotationSpeed: this.random.float(-4, 4),
      color: this.random.color(0.3),
    };
    this.bunnies.push(bunny);
  }
}
