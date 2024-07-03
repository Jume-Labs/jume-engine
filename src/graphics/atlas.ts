import { Rectangle } from 'src/math/rectangle';
import { Size } from 'src/math/size';

import { Image } from './image';

interface FrameSize {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface AtlasFrameInfo {
  fileName: string;
  trimmed: boolean;
  frame: FrameSize;
  spriteSourceSize: FrameSize;
  sourceSize: {
    w: number;
    h: number;
  };
}

interface AtlasData {
  frames: AtlasFrameInfo[];
}

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

    return new AtlasFrame(frameInfo.fileName, frameRect, frameInfo.trimmed, sourceRect, sourceSize);
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
    return this.frames[name];
  }
}
