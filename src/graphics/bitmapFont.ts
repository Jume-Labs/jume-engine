import { Image } from './image.js';

export class BitmapFont {
  /**
   * The image with the font characters.
   */
  get image(): Image {
    return this._image;
  }

  /**
   * The font height in pixels.
   */
  get height(): number {
    return this.fontData.lineHeight;
  }

  /**
   * The .fnt data.
   */
  private fontData: FontData;

  private _image: Image;

  /**
   * @param image Font image.
   * @param data content of .fnt data file.
   */
  constructor(image: Image, data: string) {
    this._image = image;
    this.fontData = new FontData(data);
  }

  /**
   * Get render data for a character.
   * @param char The char to check.
   * @returns The character render data.
   */
  getCharData(char: string): BmFontChar | null {
    return this.fontData.getCharData(char);
  }

  /**
   * Get the offset between two characters.
   * @param first The current character.
   * @param second The next character to the right.
   * @returns The offset.
   */
  getKerning(first: string, second: string): number {
    return this.fontData.getKerning(first, second);
  }

  /**
   * Get the width in pixels of the string using this font.
   * @param text The string to check.
   * @returns The width in pixels.
   */
  width(text: string): number {
    if (!text) {
      return 0;
    }

    let length = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charData = this.fontData.getCharData(char);
      if (!charData) {
        break;
      }

      length += charData.xAdvance;
      if (i > 0) {
        const prevElem = text[i - 1];
        length += this.fontData.getKerning(prevElem, char);
      }
    }
    return length;
  }
}

export interface BmFontChar {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  xOffset: number;
  yOffset: number;
  xAdvance: number;
}

export interface BmKerning {
  first: number;
  second: number;
  amount: number;
}

export class FontData {
  readonly lineHeight: number;

  private chars: Record<string, BmFontChar> = {};

  private kernings: BmKerning[] = [];

  constructor(fontData: string) {
    const lines = fontData.split(/\r?\n/);

    let height = 0;
    for (const line of lines) {
      const temp = line.trim().split(' ');
      const segments: string[] = [];
      for (const segment of temp) {
        if (segment !== '') {
          segments.push(segment);
        }
      }

      if (segments.length === 0) {
        continue;
      }

      const lineName = segments[0];
      if (lineName === 'common') {
        height = this.getFontInfo(segments[1]);
      } else if (lineName === 'char') {
        const character: BmFontChar = {
          id: this.getFontInfo(segments[1]),
          x: this.getFontInfo(segments[2]),
          y: this.getFontInfo(segments[3]),
          width: this.getFontInfo(segments[4]),
          height: this.getFontInfo(segments[5]),
          xOffset: this.getFontInfo(segments[6]),
          yOffset: this.getFontInfo(segments[7]),
          xAdvance: this.getFontInfo(segments[8]),
        };
        this.chars[character.id] = character;
      } else if (lineName === 'kerning') {
        this.kernings.push({
          first: this.getFontInfo(segments[1]),
          second: this.getFontInfo(segments[2]),
          amount: this.getFontInfo(segments[3]),
        });
      }
    }
    this.lineHeight = height;
  }

  getCharData(char: string): BmFontChar | null {
    const id = char.charCodeAt(0);

    return this.chars[id] ?? null;
  }

  getKerning(first: string, second: string): number {
    const firstChar = first.charCodeAt(0);
    const secondChar = second.charCodeAt(0);

    const index = this.kernings.findIndex((kerning: BmKerning) => {
      return kerning.first === firstChar && kerning.second === secondChar;
    });

    if (index !== -1) {
      return this.kernings[index].amount;
    }

    return 0;
  }

  private getFontInfo(segment: string): number {
    const split = segment.split('=');
    if (split.length !== 2) {
      throw 'Incorrect segment format';
    }

    return +split[1];
  }
}
