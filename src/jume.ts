import { AssetManager } from './assets/assetsManager.js';
import { AudioManager } from './audio/audioManager.js';
import { addService } from './di/services.js';
import { ApplicationEvent } from './events/applicationEvent.js';
import { EventManager } from './events/eventManager.js';
import { Context } from './graphics/context.js';
import { Graphics } from './graphics/graphics.js';
import { RenderTarget } from './graphics/renderTarget.js';
import { Input } from './input/input.js';
import { Mat4 } from './math/mat4.js';
import { Random } from './math/random.js';
import { SceneManager, SceneType } from './scenes/scenes.js';
import { isMobile } from './utils/browserInfo.js';
import { TimeStep } from './utils/timeStep.js';
import { View } from './view/view.js';

const MAX_DT = 1.0 / 15;

export class Jume {
  private prevTime = 0;

  private inBackground = false;

  private pauseInBackground = true;

  private context: Context;

  private eventManager: EventManager;

  private graphics: Graphics;

  private input: Input;

  private sceneManager: SceneManager;

  private timeStep: TimeStep;

  private view: View;

  private target: RenderTarget;

  constructor(options?: JumeOptions) {
    options ??= {};
    setDefaultOptions(options);

    const {
      name,
      designWidth,
      designHeight,
      canvasWidth,
      canvasHeight,
      canvasId,
      fullScreen,
      pauseInBackground,
      forceGL1,
      pixelFilter,
      hdpi,
      targetFps,
    } = options;

    const isFullScreen = isMobile() && fullScreen!;
    const width = isFullScreen ? window.innerWidth : canvasWidth!;
    const height = isFullScreen ? window.innerHeight : canvasHeight!;
    const pixelRatio = hdpi! ? window.devicePixelRatio : 1;

    document.title = name!;
    const canvas = document.getElementById(canvasId!) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    this.pauseInBackground = pauseInBackground!;

    this.context = new Context(canvas, forceGL1!);
    addService('context', this.context);

    this.view = new View(designWidth!, designHeight!, pixelFilter!, pixelRatio, isFullScreen, canvas, targetFps!);
    addService('view', this.view);

    this.timeStep = new TimeStep();
    addService('timeStep', this.timeStep);

    addService('audioManager', new AudioManager());

    addService('assetManager', new AssetManager());

    this.eventManager = new EventManager();
    addService('eventManager', this.eventManager);
    addService('random', new Random());

    this.graphics = new Graphics(this.context, this.view);
    addService('graphics', this.graphics);

    this.input = new Input(canvas);
    addService('input', this.input);

    this.sceneManager = new SceneManager();
    addService('sceneManager', this.sceneManager);

    this.target = new RenderTarget(this.view.viewWidth, this.view.viewHeight);

    canvas.focus();
    canvas.addEventListener('blur', () => this.toBackground());
    canvas.addEventListener('focus', () => this.toForeground());
    window.addEventListener('resize', () => this.resize(window.innerWidth, window.innerHeight));
  }

  launch(sceneType: SceneType): void {
    this.sceneManager.changeScene({ type: 'push', sceneType });

    requestAnimationFrame((_time) => {
      this.prevTime = Date.now();
      this.loop(0.016);
    });
  }

  toBackground(): void {
    this.inBackground = true;
    const event = ApplicationEvent.get(ApplicationEvent.BACKGROUND);
    this.eventManager.send(event);
    this.sceneManager.current.toBackground();
  }

  toForeground(): void {
    this.inBackground = false;
    const event = ApplicationEvent.get(ApplicationEvent.FOREGROUND);
    this.eventManager.send(event);
    this.sceneManager.current.toForeground();
  }

  private resize(width: number, height: number): void {
    const ratio = this.view.pixelRatio;
    if (this.view.isFullScreen) {
      const canvas = this.view.canvas;
      canvas.width = width * ratio;
      canvas.style.width = `${width}px`;
      canvas.height = height * ratio;
      canvas.style.height = `${height}px`;
      this.view.scaleToFit();

      this.target = new RenderTarget(this.view.viewWidth, this.view.viewHeight);
    }

    const event = ApplicationEvent.get(ApplicationEvent.RESIZE, width * ratio, height * ratio);
    this.eventManager.send(event);
    this.sceneManager.current.resize(width * ratio, height * ratio);
  }

  private loop = (_time: number): void => {
    requestAnimationFrame(this.loop);

    const now = Date.now();
    const passed = now - this.prevTime;
    if (this.view.targetFps !== -1) {
      const interval = 1.0 / this.view.targetFps;
      if (passed < interval) {
        return;
      }
      const excess = passed % interval;

      this.update(passed - excess);
      this.prevTime = now - excess;
    } else {
      this.update(passed);
      this.prevTime = now;
    }
  };

  private update(dt: number): void {
    if (!this.inBackground || !this.pauseInBackground) {
      // Make sure time doesn't skip too much.
      if (dt > MAX_DT) {
        dt = MAX_DT;
      }
      this.timeStep.update(dt);
      this.sceneManager.update(this.timeStep.dt);

      this.render();
    }
  }

  private render(): void {
    this.graphics.transform.identity();
    this.graphics.pushTarget(this.target);

    this.sceneManager.render(this.graphics);

    this.graphics.popTarget();

    // TODO: Draw fps and memory here.
    this.graphics.transform.identity();
    this.graphics.color.set(1, 1, 1, 1);

    Mat4.fromScale(this.view.viewScaleX, this.view.viewScaleY, 1, this.graphics.transform);

    this.graphics.start();
    this.graphics.drawRenderTarget(0, 0, this.target);
    this.graphics.present();
  }
}

interface JumeOptions {
  name?: string;
  designWidth?: number;
  designHeight?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  canvasId?: string;
  pauseInBackground?: boolean;
  forceGL1?: boolean;
  pixelFilter?: boolean;
  fullScreen?: boolean;
  hdpi?: boolean;
  targetFps?: number;
}

function setDefaultOptions(options: JumeOptions): void {
  options.name ??= 'Jume Game';
  options.designWidth ??= 800;
  options.designHeight ??= 600;
  options.canvasWidth ??= options.designWidth;
  options.canvasHeight ??= options.designHeight;
  options.canvasId ??= 'jume';
  options.fullScreen ??= false;
  options.pauseInBackground ??= true;
  options.forceGL1 ??= false;
  options.pixelFilter ??= false;
  options.hdpi ??= false;
  options.targetFps ??= -1;
}
