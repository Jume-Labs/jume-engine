import { addService } from './di/services';
import { isMobile } from './utils/browserInfo';
import { TimeStep } from './utils/timeStep';
import { View } from './view/view';

const MAX_DT = 1.0 / 15;

export class Jume {
  private prevTime = 0;

  private inBackground = false;

  private pauseInBackground = true;

  private timeStep: TimeStep;

  private view: View;

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

    console.log(forceGL1);

    const isFullScreen = isMobile() && fullScreen!;
    const width = isFullScreen ? window.innerWidth : canvasWidth!;
    const height = isFullScreen ? window.innerHeight : canvasHeight!;
    const pixelRatio = hdpi! ? window.devicePixelRatio : 1;

    document.title = name!;
    const canvas = document.getElementById(canvasId!) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    this.view = new View(designWidth!, designHeight!, pixelFilter!, pixelRatio, isFullScreen, canvas, targetFps!);
    addService('view', this.view);

    this.timeStep = new TimeStep();
    addService('timeStep', this.timeStep);

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    this.pauseInBackground = pauseInBackground!;

    canvas.focus();
    canvas.addEventListener('blur', () => this.toBackground());
    canvas.addEventListener('focus', () => this.toForeground());
    window.addEventListener('resize', () => this.resize(window.innerWidth, window.innerHeight));
  }

  launch() {
    requestAnimationFrame((_time) => {
      this.prevTime = Date.now();
      this.loop(0.016);
    });
  }

  toBackground() {
    this.inBackground = true;
  }

  toForeground() {
    this.inBackground = false;
  }

  private resize(_width: number, _height: number) {}

  private loop(_time: number) {
    requestAnimationFrame(this.loop);

    const now = Date.now();
    const passed = now - this.prevTime;
    if (this.view.targetFps != -1) {
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
  }

  private update(dt: number) {
    if (!this.inBackground || !this.pauseInBackground) {
      // Make sure time doesn't skip too much.
      if (dt > MAX_DT) {
        dt = MAX_DT;
      }
      this.timeStep.update(dt);

      this.render();
    }
  }

  private render() {}
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

function setDefaultOptions(options: JumeOptions) {
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
