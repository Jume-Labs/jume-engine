import { clamp } from '../math/mathUtils.js';
import { Sound } from './sound.js';

/**
 * An audio channel controls the playback of a sound.
 */
export class AudioChannel {
  /**
   * The current sound for this channel.
   */
  sound?: Sound;

  /**
   * The channel buffer source.
   */
  source?: AudioBufferSourceNode;

  startTime: number;

  pauseTime: number;

  loop: number;

  ended: boolean;

  paused: boolean;

  get gain(): GainNode {
    return this._gain;
  }

  get volume(): number {
    return this._gain.gain.value;
  }

  set volume(value: number) {
    this._gain.gain.value = clamp(value, 0, 1);
  }

  private _gain: GainNode;

  constructor(gain: GainNode) {
    this._gain = gain;
    this.volume = 1;
    this.startTime = 0;
    this.pauseTime = 0;
    this.loop = 0;
    this.ended = false;
    this.paused = false;
  }

  pause(time: number): void {
    if (this.source) {
      this.pauseTime = time - this.startTime;
      this.paused = true;
      this.source.disconnect();
      this._gain.disconnect();
      this.source.stop();
      this.source = undefined;
    }
  }

  stop(): void {
    if (this.source) {
      this.source.disconnect();
      this._gain.disconnect();
      this.source.stop();
      this.source = undefined;
      this.ended = true;
      this.paused = true;
    }
  }
}
