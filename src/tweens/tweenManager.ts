import { Tween } from './tween';
import { TweenSequence } from './tweenSequence';

export class TweenManager {
  private readonly current: Tween[] = [];

  private readonly sequences: TweenSequence[] = [];

  private completed: Tween[] = [];

  constructor() {}

  addTween(tween: Tween): void {
    this.current.push(tween);
  }

  addSequence(sequence: TweenSequence): void {
    this.sequences.push(sequence);
  }

  update(dt: number): void {
    for (const tween of this.current) {
      tween.update(dt);
      if (tween.complete) {
        if (tween.repeat > tween.timesCompleted || tween.repeat === -1) {
          tween.restart();
          tween.timesCompleted++;
        } else {
          this.completed.push(tween);
        }
      }
    }

    while (this.completed.length > 0) {
      const tween = this.completed.pop()!;
      this.removeTween(tween);
      tween.runComplete();
    }

    for (const sequence of this.sequences) {
      if (sequence.index > sequence.list.length - 1) {
        sequence.index = 0;
      }

      const tween = sequence.currentTween;
      tween.update(dt);
      if (tween.complete) {
        if (tween.repeat > tween.timesCompleted || tween.repeat === -1) {
          tween.timesCompleted++;
          tween.resetTime();
          tween.complete = false;
          tween.paused = false;
        } else {
          tween.runComplete();
          sequence.index++;

          if (sequence.repeat > sequence.timesCompleted || sequence.repeat === -1) {
            for (const seqTween of sequence.list) {
              seqTween.complete = false;
              seqTween.resetTime();
            }
            sequence.timesCompleted++;
          } else {
            const index = this.sequences.indexOf(sequence);
            if (index !== -1) {
              this.sequences.splice(index, 1);
            }
          }
        }
      }
    }
  }

  pauseAll(): void {
    for (const tween of this.current) {
      tween.paused = true;
    }

    for (const sequence of this.sequences) {
      sequence.currentTween.paused = true;
    }
  }

  resumeAll(): void {
    for (const tween of this.current) {
      tween.paused = false;
    }

    for (const sequence of this.sequences) {
      sequence.currentTween.paused = false;
    }
  }

  removeTween(tween: Tween): void {
    const index = this.current.indexOf(tween);
    if (index !== -1) {
      this.current.splice(index, 1);
    }
  }

  removeSequence(sequence: TweenSequence): void {
    const index = this.sequences.indexOf(sequence);
    if (index !== -1) {
      this.sequences.splice(index, 1);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeAllFrom(target: Record<string, any>): void {
    const tweensToRemove: Tween[] = [];
    for (const tween of this.current) {
      if (tween.target === target) {
        tweensToRemove.push(tween);
      }
    }

    for (const tween of tweensToRemove) {
      const index = this.current.indexOf(tween);
      if (index !== -1) {
        this.current.splice(index);
      }
    }
  }
}
