export class Sound {
  readonly name: string;

  readonly buffer: AudioBuffer;

  constructor(name: string, buffer: AudioBuffer) {
    this.name = name;
    this.buffer = buffer;
  }
}
