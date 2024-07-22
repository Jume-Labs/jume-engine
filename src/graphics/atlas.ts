import { Rectangle } from '../math/rectangle.js';
import { Size } from '../math/size.js';
import { Image } from './image.js';

type FrameSize = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type AtlasFrameInfo = {
  filename: string;
  trimmed: boolean;
  frame: FrameSize;
  spriteSourceSize: FrameSize;
  sourceSize: {
    w: number;
    h: number;
  };
};

type AtlasData = {
  frames: AtlasFrameInfo[];
};

export class AtlasFrame {
  readonly name: string;

  readonly frame: Rectangle;

  readonly trimmed: boolean;

  readonly sourceRect: Rectangle;

  readonly sourceSize: Size;

  static fromJsonFrame(frameInfo: AtlasFrameInfo): AtlasFrame {
    const frameRect = new Rectangle(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h);
    const sourceRect = new Rectangle(
      frameInfo.spriteSourceSize.x,
      frameInfo.spriteSourceSize.y,
      frameInfo.spriteSourceSize.w,
      frameInfo.spriteSourceSize.h
    );
    const sourceSize = new Size(frameInfo.sourceSize.w, frameInfo.sourceSize.h);

    return new AtlasFrame(frameInfo.filename, frameRect, frameInfo.trimmed, sourceRect, sourceSize);
  }

  constructor(name: string, frame: Rectangle, trimmed: boolean, sourceRect: Rectangle, sourceSize: Size) {
    this.name = name;
    this.frame = frame;
    this.trimmed = trimmed;
    this.sourceRect = sourceRect;
    this.sourceSize = sourceSize;
  }
}

export class Atlas {
  readonly image: Image;

  private frames: Record<string, AtlasFrame> = {};

  constructor(image: Image, data: string) {
    this.image = image;

    const frameData = JSON.parse(data) as AtlasData;
    for (const frameInfo of frameData.frames) {
      const frame = AtlasFrame.fromJsonFrame(frameInfo);
      this.frames[frame.name] = frame;
    }
  }

  getFrame(name: string): AtlasFrame {
    if (!this.frames[name]) {
      console.log(`Frame ${name} does not exist in atlas`);
    }

    return this.frames[name];
  }
}
