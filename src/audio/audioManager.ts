import { AudioChannel } from './audioChannel';
import { Sound } from './sound';

export class AudioManager {
  readonly context: AudioContext;

  private readonly mainGain: GainNode;

  private audioChannels: AudioChannel[];

  private prevVolume: number;

  private muted: boolean;

  constructor() {
    this.context = new AudioContext();
    this.mainGain = this.context.createGain();
    this.mainGain.connect(this.context.destination);

    this.audioChannels = [];
    this.prevVolume = 1;
    this.muted = false;

    for (let i = 0; i < 16; i++) {
      this.audioChannels.push(new AudioChannel(this.context.createGain()));
    }
  }

  getVolume(channelId?: number): number {
    if (channelId) {
      return this.audioChannels[channelId].volume;
    } else {
      return this.mainGain.gain.value;
    }
  }

  setVolume(value: number, channelId?: number): void {
    if (channelId) {
      this.audioChannels[channelId].volume = value;
    } else {
      this.mainGain.gain.value = value;
    }
  }

  getLoop(channelId: number): number {
    return this.audioChannels[channelId].loop;
  }

  setLoop(value: number, channelId: number): void {
    this.audioChannels[channelId].loop = value;
  }

  getFreeChannel(): number {
    for (let i = 0; i < this.audioChannels.length; i++) {
      if (this.audioChannels[i].ended) {
        return i;
        break;
      }
    }

    return -1;
  }

  play(sound: Sound, loop = 0, volume = 1, channelId = -1, startTime = 0): number {
    if (channelId === -1) {
      channelId = this.getFreeChannel();
      if (channelId === -1) {
        throw new Error('Unable to play sound. All audio channels are in use.');
      }
    }

    const channel = this.audioChannels[channelId];
    if (channel.sound) {
      channel.stop();
    }

    const source = this.context.createBufferSource();
    source.buffer = sound.buffer;
    source.connect(channel.gain);
    channel.gain.connect(this.mainGain);
    channel.startTime = this.context.currentTime - startTime;
    source.start(0, startTime);
    channel.volume = volume;

    source.onended = (event): void => {
      if (channel.paused) {
        return;
      }

      if (event.target === source) {
        if (channel.loop > 0 || channel.loop === -1) {
          if (channel.loop !== -1) {
            channel.loop--;
          }

          this.play(sound, channel.loop, channel.volume, channelId);
          channel.startTime = this.context.currentTime;
        } else if (channel.loop === 0) {
          channel.stop();
        }
      }
    };

    channel.paused = false;
    channel.source = source;
    channel.ended = false;
    channel.loop = loop;
    channel.sound = sound;

    return channelId;
  }

  stop(channelId?: number): void {
    const channels = channelId ? [this.audioChannels[channelId]] : this.audioChannels;
    for (const channel of channels) {
      channel.stop();
    }
  }

  pause(channelId?: number): void {
    const time = this.context.currentTime;
    const channels = channelId ? [this.audioChannels[channelId]] : this.audioChannels;
    for (const channel of channels) {
      channel.pause(time);
    }
  }

  resume(channelId: number): void {
    if (channelId) {
      const channel = this.audioChannels[channelId];
      if (channel.paused && channel.sound) {
        this.play(channel.sound, channel.loop, channel.volume, channelId, channel.pauseTime);
      }
    } else {
      for (let i = 0; i < this.audioChannels.length; i++) {
        const channel = this.audioChannels[i];
        if (channel.paused && channel.sound) {
          this.play(channel.sound, channel.loop, channel.volume, channelId, channel.pauseTime);
        }
      }
    }
  }

  isPlaying(channelId: number): boolean {
    return !this.audioChannels[channelId].ended && !this.audioChannels[channelId].paused;
  }

  isMuted(): boolean {
    return this.muted;
  }

  mute(): void {
    if (!this.muted) {
      this.prevVolume = this.getVolume();
      this.muted = true;
      this.setVolume(0);
    }
  }

  unMute(): void {
    if (this.muted) {
      this.muted = false;
      this.setVolume(this.prevVolume);
    }
  }

  async decodeSound(name: string, buffer: ArrayBuffer): Promise<Sound | null> {
    const data = await this.context.decodeAudioData(buffer);
    if (data) {
      return new Sound(name, data);
    }

    return null;
  }
}
