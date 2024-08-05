import {
  Assets,
  BitmapFont,
  EventListener,
  Events,
  inject,
  MouseEvent,
  Scene,
  SRender,
  SUpdate,
  TimeStep,
  View,
} from '@jume-labs/jume-engine';

import { EBunny } from '../entities/eBunny';
import { EText } from '../entities/eText';

export class BunnyScene extends Scene {
  private addingBunnies = false;

  private fps: EText;

  private bunnyText: EText;

  private bunnyCount = 0;

  @inject
  private assets!: Assets;

  @inject
  private events!: Events;

  @inject
  private timeStep!: TimeStep;

  @inject
  private view!: View;

  private mouseDownListener: EventListener;

  private mouseUpListener: EventListener;

  constructor() {
    super();
    this.view.debugRender = false;

    this.addSystem(SUpdate, 0, {});
    this.addSystem(SRender, 0, {});

    const font = this.assets.get(BitmapFont, 'font');

    this.fps = this.addEntity(EText, { layer: 1, x: 16, y: 16, font, text: 'FPS: 0', anchor: { x: 0, y: 0.5 } });
    this.bunnyText = this.addEntity(EText, {
      layer: 1,
      x: 16,
      y: 48,
      font,
      text: 'Bunnies: 0',
      anchor: { x: 0, y: 0.5 },
    });

    this.mouseDownListener = this.events.add(MouseEvent.MOUSE_DOWN, this.mouseDown);
    this.mouseUpListener = this.events.add(MouseEvent.MOUSE_UP, this.mouseUp);

    this.createBunny();
  }

  override update(dt: number): void {
    super.update(dt);

    this.fps.txt.text = `FPS: ${this.timeStep.fps}`;

    if (this.addingBunnies) {
      for (let i = 0; i < 20; i++) {
        this.createBunny();
      }
    }
  }

  override destroy(): void {
    this.events.remove(this.mouseDownListener);
    this.events.remove(this.mouseUpListener);
  }

  private createBunny(): void {
    this.addEntity(EBunny);

    this.bunnyCount++;
    this.bunnyText.txt.text = `Bunnies: ${this.bunnyCount}`;
  }

  private mouseDown = (_event: MouseEvent): void => {
    this.addingBunnies = true;
  };

  private mouseUp = (_event: MouseEvent): void => {
    this.addingBunnies = false;
  };
}
