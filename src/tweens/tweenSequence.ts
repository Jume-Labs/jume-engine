import { Tween } from './tween.js';

export class TweenSequence {
  list: Tween[];

  index = 0;

  timesCompleted = 0;

  repeat = 0;

  get currentTween(): Tween {
    return this.list[this.list.length - 1];
  }

  constructor(tweens: Tween[], repeat = 0) {
    this.list = tweens;
    this.repeat = repeat;
  }

  reset(): void {
    this.index = 0;
    this.timesCompleted = 0;

    for (const tween of this.list) {
      tween.reset();
    }
  }

  restart(): void {
    this.index = 0;

    for (const tween of this.list) {
      tween.restart();
    }
  }
}
