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

/**
 * The properties you can use to customize the Jume engine startup.
 */
type JumeProps = {
  /**
   * The name that goes in the title of the page.
   */
  name?: string;

  /**
   * The width in pixels the game is designed for before scaling.
   */
  designWidth?: number;

  /**
   * The height in pixels the game is designed for before scaling.
   */
  designHeight?: number;

  /**
   * The html canvas width in pixels. If not provided it will be set the the design width.
   */
  canvasWidth?: number;

  /**
   * The html canvas height in pixels. If not provided it will be set the the design height.
   */
  canvasHeight?: number;

  /**
   * The id of the html canvas. Default is 'jume'.
   */
  canvasId?: string;

  /**
   * Should the game pause when not focused. Default is true.
   */
  pauseInBackground?: boolean;

  /**
   * Should WebGL 1 be used even if 2 is available. Default is false.
   */
  forceGL1?: boolean;

  /**
   * Should all filtering be 'nearest'. This is good for pixel art games.
   */
  pixelFilter?: boolean;

  /**
   * Should the game be the full width of the browser.
   * TODO: Make this work properly on desktop.
   */
  fullScreen?: boolean;

  /**
   * Should the game use the actual pixels instead of browser pixel ratio pixels. Default is false.
   * This will look better, but performance will be worse if there is a lot on the screen.
   */
  hdpi?: boolean;

  /**
   * The target fps to run the game in. Default is 60.
   */
  targetFps?: number;
};

/**
 * This is the maximum value the delta time can be. To prevent big spikes.
 */
const MAX_DT = 1.0 / 15;

/**
 * Set default values for the props that are not provided.
 * @param props The startup properties.
 */
function setDefaultPropValues(props: JumeProps): void {
  props.name ??= 'Jume Game';
  props.designWidth ??= 800;
  props.designHeight ??= 600;
  props.canvasWidth ??= props.designWidth;
  props.canvasHeight ??= props.designHeight;
  props.canvasId ??= 'jume';
  props.fullScreen ??= false;
  props.pauseInBackground ??= true;
  props.forceGL1 ??= false;
  props.pixelFilter ??= false;
  props.hdpi ??= false;
  props.targetFps ??= -1;
}

/**
 * This is the main engine class. You use this to start the game.
 */
export class Jume {
  /**
   * The time passed on the previous update.
   */
  private prevTime = 0;

  /**
   * Check to see if the game is running in the background.
   */
  private inBackground = false;

  /**
   * Check to see if the game should pause when in the background.
   */
  private pauseInBackground = true;

  /**
   * The rendering context.
   */
  private context: Context;

  /**
   * The game event manager.
   */
  private eventManager: EventManager;

  /**
   * The main graphics reference.
   */
  private graphics: Graphics;

  /**
   * The input manager.
   */
  private input: Input;

  /**
   * The game scene manager use to switch scenes.
   */
  private sceneManager: SceneManager;

  /**
   * The time step controls time in the game.
   */
  private timeStep: TimeStep;

  /**
   * The view class to get view / canvas sizes etc.
   */
  private view: View;

  /**
   * The main render target.
   */
  private target: RenderTarget;

  /**
   * Create a new jume game instance.
   * @param props The startup properties.
   */
  constructor(props?: JumeProps) {
    props ??= {};
    setDefaultPropValues(props);

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
    } = props;

    const isFullScreen = isMobile() && fullScreen!;
    const width = isFullScreen ? window.innerWidth : canvasWidth!;
    const height = isFullScreen ? window.innerHeight : canvasHeight!;
    const pixelRatio = hdpi! ? window.devicePixelRatio : 1;

    document.title = name!;

    const canvas = document.getElementById(canvasId!) as HTMLCanvasElement;

    // If there is no canvas the game can't start so throw an error.
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

    const assetManager = new AssetManager();
    addService('assetManager', assetManager);
    assetManager.registerBuiltinLoaders();

    this.eventManager = new EventManager();
    addService('eventManager', this.eventManager);
    addService('random', new Random());

    this.graphics = new Graphics(this.context, this.view);
    addService('graphics', this.graphics);

    this.input = new Input(canvas);
    addService('input', this.input);

    this.sceneManager = new SceneManager();
    addService('sceneManager', this.sceneManager);

    this.target = new RenderTarget(
      this.view.viewWidth,
      this.view.viewHeight,
      this.view.pixelFilter ? 'nearest' : 'linear',
      this.view.pixelFilter ? 'nearest' : 'linear'
    );

    canvas.focus();
    canvas.addEventListener('blur', () => this.toBackground());
    canvas.addEventListener('focus', () => this.toForeground());
    window.addEventListener('resize', () => this.resize(window.innerWidth, window.innerHeight));
  }

  /**
   * Launch the game. This is a separate function to make sure all internal systems are started.
   * @param sceneType The scene type to start with.
   */
  launch(sceneType: SceneType): void {
    this.sceneManager.changeScene({ type: 'push', sceneType });

    requestAnimationFrame((_time) => {
      this.prevTime = Date.now();
      this.loop(0.016);
    });
  }

  /**
   * Move the game to the background. Can be called from outside if needed. Like with capacitor for example.
   */
  toBackground(): void {
    this.inBackground = true;
    const event = ApplicationEvent.get('background');
    this.eventManager.send(event);
    if (this.sceneManager.current) {
      this.sceneManager.current.toBackground();
    }
  }

  /**
   * Move the game to foreground. Can be called from outside if needed. Like with capacitor for example.
   */
  toForeground(): void {
    this.inBackground = false;
    const event = ApplicationEvent.get('foreground');
    this.eventManager.send(event);
    if (this.sceneManager.current) {
      this.sceneManager.current.toForeground();
    }
  }

  /**
   * Gets called when the browser window resizes.
   * @param width The new window width in pixels.
   * @param height The new window height in pixels.
   */
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

    const event = ApplicationEvent.get('resize', width * ratio, height * ratio);
    this.eventManager.send(event);
    if (this.sceneManager.current) {
      this.sceneManager.current.resize(width * ratio, height * ratio);
    }
  }

  /**
   * This is the main game loop.
   * @param _time
   */
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

      this.update((passed - excess) / 1000);
      this.prevTime = now - excess;
    } else {
      this.update(passed / 1000);
      this.prevTime = now;
    }
  };

  /**
   * This updates everything in the game and then renders it.
   * @param dt The time passed since the last update in seconds.
   */
  private update(dt: number): void {
    if (!this.inBackground || !this.pauseInBackground) {
      // Make sure time doesn't skip too much.
      if (dt > MAX_DT) {
        dt = MAX_DT;
      }
      this.timeStep.update(dt);

      // Use time step dt here because the time step can slow down or speed up the game.
      this.sceneManager.update(this.timeStep.dt);

      this.render();
    }
  }

  /**
   * Render the game.
   */
  private render(): void {
    // Reset the transform.
    this.graphics.transform.identity();

    // Push the main render target on the stack.
    this.graphics.pushTarget(this.target);

    // Render the scene to the render target.
    this.sceneManager.render(this.graphics);

    // Pop the target from the stack.
    this.graphics.popTarget();

    // TODO: Draw fps and memory here.

    // Reset the transform and color.
    this.graphics.transform.identity();
    this.graphics.color.set(1, 1, 1, 1);

    // Scale the render target to fit the canvas. This scales from view pixels to canvas pixels.
    Mat4.fromScale(this.view.viewScaleX, this.view.viewScaleY, 1, this.graphics.transform);

    // Draw the render target to the canvas.
    this.graphics.start();
    this.graphics.drawRenderTarget(0, 0, this.target);
    this.graphics.present();
  }
}
