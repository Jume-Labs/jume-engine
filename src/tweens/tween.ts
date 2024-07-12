/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from '../di/inject.js';
import { Color } from '../graphics/color.js';
import { TimeStep } from '../utils/timeStep.js';
import { Ease, easeLinear } from './easing.js';

interface TweenProperty {
  start: number | Color;
  end: number | Color;
  propertyName: string;
  change?: number;
}

export class Tween {
  complete = false;

  repeat = 0;

  timesCompleted = 0;

  ignoreTimescale = false;

  paused = false;

  get target(): Record<string, any> {
    return this._target;
  }

  get percentageComplete(): number {
    return (this.time / this.duration) * 100;
  }

  private _target: Record<string, any>;

  private time = 0;

  private duration: number;

  private dataList: TweenProperty[] = [];

  private ease = easeLinear;

  private onComplete?: () => void;

  private onUpdate?: (target: Record<string, any>) => void;

  private delay = 0;

  private delayTime = 0;

  private tempColor = new Color();

  @inject
  private timeStep!: TimeStep;

  constructor(
    target: Record<string, any>,
    duration: number,
    from: Record<string, any>,
    to: Record<string, any>,
    repeat = 0,
    ignoreTimescale = false
  ) {
    this._target = target;
    this.duration = duration;
    this.repeat = repeat;
    this.ignoreTimescale = ignoreTimescale;

    this.createDataList(this._target, from, to);
  }

  reset(): void {
    this.time = 0;
    this.delayTime = 0;
    this.timesCompleted = 0;
    this.paused = false;
    this.complete = false;
  }

  restart(): void {
    this.time = 0;
    this.complete = false;
  }

  resetTime(): void {
    this.time = 0;
  }

  setEase(ease: Ease): Tween {
    this.ease = ease;

    return this;
  }

  setOnComplete(callback: () => void): Tween {
    this.onComplete = callback;

    return this;
  }

  setOnUpdate(callback: (target: Record<string, any>) => void): Tween {
    this.onUpdate = callback;

    return this;
  }

  setDelay(delay: number): Tween {
    this.delay = delay;
    this.delayTime = 0;

    return this;
  }

  runComplete(): void {
    if (this.onComplete) {
      this.onComplete();
    }
    this.time = 0;
  }

  update(dt: number): void {
    if (this.complete || this.paused) {
      return;
    }

    if (this.ignoreTimescale) {
      dt = this.timeStep.unscaledDt;
    }

    if (this.delayTime < this.delay) {
      this.delayTime += dt;
    } else {
      this.time += dt;
      if (this.time >= this.duration) {
        this.complete = true;
      }

      for (const data of this.dataList) {
        this.updateProperty(data);
      }

      if (this.onUpdate) {
        this.onUpdate(this._target);
      }
    }
  }

  updateTarget(target: Record<string, any>, from: Record<string, any>, to: Record<string, any>): void {
    this._target = target;
    this.createDataList(this._target, from, to);
  }

  private createDataList(target: Record<string, any>, from: Record<string, any>, to: Record<string, any>): void {
    this.dataList = [];

    for (const key in from) {
      if (target[key]) {
        let startValue = from[key] as number | Color;
        let endValue = to[key] as number | Color;

        if (startValue instanceof Color) {
          startValue = startValue.clone();
        }

        if (endValue instanceof Color) {
          endValue = endValue.clone();
        }

        const data: TweenProperty = {
          propertyName: key,
          start: startValue,
          end: endValue,
        };

        if (!(startValue instanceof Color) && !(endValue instanceof Color)) {
          data.change = endValue - startValue;
        }
      }
    }
  }

  private updateProperty(data: TweenProperty): void {
    if (data.start instanceof Color && data.end instanceof Color) {
      const factor = this.ease(this.time, 0, 1, this.duration);
      Color.interpolate(data.start, data.end, factor, this.tempColor);
      if (this.complete) {
        this.tempColor.copyFrom(data.end);
      }
      this._target[data.propertyName] = this.tempColor;
    } else {
      let value = this.ease(this.time, data.start as number, data.change as number, this.duration);
      if (this.complete) {
        value = data.end as number;
      }
      this._target[data.propertyName] = value;
    }
  }
}
