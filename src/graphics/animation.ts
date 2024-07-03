import { Atlas, AtlasFrame } from './atlas';

export type AnimationMode = 'normal' | 'loop' | 'reversed' | 'loop reversed' | 'ping pong';

export class Animation {
  readonly name: string;

  readonly frames: string[];

  frameDuration: number;

  playMode: AnimationMode;

  atlas: Atlas;

  constructor(name: string, atlas: Atlas, frames: string[], frameDuration: number, playMode: AnimationMode = 'normal') {
    this.name = name;
    this.atlas = atlas;
    this.frames = frames;
    this.frameDuration = frameDuration;
    this.playMode = playMode;
  }

  getFrame(time: number): AtlasFrame {
    return this.atlas.getFrame(this.frames[this.getFrameIndex(time)]);
  }

  getFrameName(time: number): string {
    return this.frames[this.getFrameIndex(time)];
  }

  finished(time: number): boolean {
    if (this.playMode === 'loop' || this.playMode === 'loop reversed' || this.playMode === 'ping pong') {
      return false;
    }

    return Math.floor(time / this.frameDuration) > this.frames.length;
  }

  private getFrameIndex(time: number): number {
    if (this.frames.length === 1) {
      return 0;
    }

    let frameNumber = Math.floor(time / this.frameDuration);
    switch (this.playMode) {
      case 'normal':
        frameNumber = Math.floor(Math.min(this.frames.length - 1, frameNumber));
        break;

      case 'loop':
        frameNumber = frameNumber % this.frames.length;
        break;

      case 'ping pong':
        frameNumber = frameNumber % (this.frames.length * 2 - 2);
        if (frameNumber >= this.frames.length) {
          frameNumber = this.frames.length - 2 - (frameNumber - this.frames.length);
        }
        break;

      case 'reversed':
        frameNumber = Math.floor(Math.max(this.frames.length - frameNumber - 1, 0));
        break;

      case 'loop reversed':
        frameNumber = frameNumber % this.frames.length;
        frameNumber = this.frames.length - frameNumber - 1;
        break;
    }

    return frameNumber;
  }
}
