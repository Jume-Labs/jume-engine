import {
  AssetManager,
  BitmapFont,
  CText,
  CTextProps,
  CTransform,
  CTransformProps,
  Entity,
  EventListener,
  EventManager,
  inject,
  MouseEvent,
  Scene,
  SRender,
  SUpdate,
  TimeStep,
} from '@jume-labs/jume-engine';

import { EBunny } from '../entities/eBunny';

export class BunnyScene extends Scene {
  private addingBunnies = false;

  private fpsTextComp: CText;

  private bunniesTextComp: CText;

  private bunnyCount = 0;

  @inject
  private assetManager!: AssetManager;

  @inject
  private eventManager!: EventManager;

  @inject
  private timeStep!: TimeStep;

  private mouseDownListener: EventListener;
  private mouseUpListener: EventListener;

  constructor() {
    super();
    this.view.debugRender = false;

    this.addSystem(SUpdate, {});
    this.addSystem(SRender, {});

    const font = this.assetManager.getAsset(BitmapFont, 'font');

    const fpsText = new Entity();
    fpsText.layer = 1;
    fpsText.addComponent<CTransform, CTransformProps>(CTransform, { x: 16, y: 16 });
    this.fpsTextComp = fpsText.addComponent<CText, CTextProps>(CText, {
      font,
      text: 'FPS: 0',
      anchor: { x: 0, y: 0.5 },
    });
    this.addEntity(fpsText);

    const bunniesText = new Entity();
    bunniesText.layer = 1;
    bunniesText.addComponent<CTransform, CTransformProps>(CTransform, { x: 16, y: 48 });
    this.bunniesTextComp = bunniesText.addComponent<CText, CTextProps>(CText, {
      font,
      text: 'Bunnies: 0',
      anchor: { x: 0, y: 0.5 },
    });
    this.addEntity(bunniesText);

    this.mouseDownListener = this.eventManager.add(MouseEvent.MOUSE_DOWN, this.mouseDown);
    this.mouseUpListener = this.eventManager.add(MouseEvent.MOUSE_UP, this.mouseUp);

    this.createBunny();
  }

  override update(dt: number): void {
    super.update(dt);

    this.fpsTextComp.text = `FPS: ${this.timeStep.fps}`;

    if (this.addingBunnies) {
      for (let i = 0; i < 20; i++) {
        this.createBunny();
      }
    }
  }

  override destroy(): void {
    this.eventManager.remove(this.mouseDownListener);
    this.eventManager.remove(this.mouseUpListener);
  }

  private createBunny(): void {
    this.addEntity(new EBunny());

    this.bunnyCount++;
    this.bunniesTextComp.text = `Bunnies: ${this.bunnyCount}`;
  }

  private mouseDown = (_event: MouseEvent): void => {
    this.addingBunnies = true;
  };

  private mouseUp = (_event: MouseEvent): void => {
    this.addingBunnies = false;
  };
}
