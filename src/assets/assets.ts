import { AudioManager } from 'src/audio/audioManager';
import { Sound } from 'src/audio/sound';
import { inject } from 'src/di/inject';
import { Atlas } from 'src/graphics/atlas';
import { BitmapFont } from 'src/graphics/bitmapFont';
import { Context } from 'src/graphics/context';
import { Image } from 'src/graphics/image';
import { Shader } from 'src/graphics/shader';
import { ShaderType } from 'src/graphics/types';

export class Assets {
  private images: Record<string, Image> = {};

  private texts: Record<string, string> = {};

  private bitmapFonts: Record<string, BitmapFont> = {};

  private shaders: Record<string, Shader> = {};

  private sounds: Record<string, Sound> = {};

  private atlases: Record<string, Atlas> = {};

  @inject
  private readonly audio!: AudioManager;

  @inject
  private readonly context!: Context;

  constructor() {}

  async loadImage(id: string, path: string, keep = true): Promise<Image> {
    return new Promise((resolve, reject) => {
      const element = document.createElement('img');
      element.onload = (): void => {
        element.onload = null;

        const canvas = document.createElement('canvas');
        canvas.width = element.width;
        canvas.height = element.height;

        const canvasContext = canvas.getContext('2d');
        canvasContext?.drawImage(element, 0, 0);

        const data = canvasContext?.getImageData(0, 0, element.width, element.height).data;
        if (data) {
          const image = new Image(element.width, element.height, data);
          if (keep) {
            this.images[id] = image;
          }

          resolve(image);
        } else {
          reject(`Unable to load image "${id}".`);
        }
      };

      element.onerror = (): void => {
        reject(`Unable to load image "${id}".`);
      };

      element.src = path;
    });
  }

  addImage(id: string, image: Image): void {
    this.images[id] = image;
  }

  getImage(id: string): Image {
    if (this.images[id]) {
      return this.images[id];
    }

    throw new Error(`Image "${id}" is not loaded.`);
  }

  unloadImage(id: string): void {
    if (this.images[id]) {
      this.images[id].destroy();
      delete this.images[id];
    }
  }

  async loadText(id: string, path: string, keep = true): Promise<string> {
    const response = await fetch(path);
    if (response.status < 400) {
      const text = await response.text();
      if (keep) {
        this.texts[id] = text;
      }

      return text;
    } else {
      throw new Error(`Unable to load text ${id}.`);
    }
  }

  addText(id: string, text: string): void {
    this.texts[id] = text;
  }

  getText(id: string): string {
    if (this.texts[id]) {
      return this.texts[id];
    }

    throw new Error(`Text "${id}" is not loaded.`);
  }

  unloadText(id: string): void {
    if (this.texts[id]) {
      delete this.texts[id];
    }
  }

  async loadBitmapFont(id: string, path: string, keep = true): Promise<BitmapFont> {
    const image = await this.loadImage(`jume_bitmap_font_${id}`, `${path}.png`, keep);
    const data = await this.loadText(`jume_bitmap_font_${id}`, `${path}.fnt`, keep);

    const font = new BitmapFont(image, data);
    if (keep) {
      this.bitmapFonts[id] = font;
    }

    return font;
  }

  addBitmapFont(id: string, font: BitmapFont): void {
    this.bitmapFonts[id] = font;
  }

  getBitmapFont(id: string): BitmapFont {
    if (this.bitmapFonts[id]) {
      return this.bitmapFonts[id];
    }

    throw new Error(`Bitmap font "${id}" is not loaded.`);
  }

  unloadBitmapFont(id: string): void {
    if (this.bitmapFonts[id]) {
      this.unloadImage(`jume_bitmap_font_${id}`);
      this.unloadText(`jume_bitmap_font_${id}`);
      delete this.bitmapFonts[id];
    }
  }

  async loadShader(id: string, path: string, keep = true): Promise<Shader> {
    const dotIndex = path.lastIndexOf('.');
    if (dotIndex === -1) {
      throw new Error(`Path ${path} is missing the file extension`);
    }

    const dirAndFile = path.substring(0, dotIndex);
    const extension = path.substring(dotIndex);

    if (this.context.isGL1) {
      path = `${dirAndFile}.gl1${extension}`;
    }

    const shaderType: ShaderType = extension === '.vert' ? 'vertex' : 'fragment';

    const source = await this.loadText(`jume_shader_${id}`, path, false);
    const shader = new Shader(source, shaderType);

    if (keep) {
      this.shaders[id] = shader;
    }

    return shader;
  }

  addShader(id: string, shader: Shader): void {
    this.shaders[id] = shader;
  }

  getShader(id: string): Shader {
    if (this.shaders[id]) {
      return this.shaders[id];
    }

    throw new Error(`Shader "${id}" is not loaded.`);
  }

  unloadShader(id: string): void {
    if (this.shaders[id]) {
      this.shaders[id].destroy();
      delete this.shaders[id];
    }
  }

  async loadSound(id: string, path: string, keep = true): Promise<Sound> {
    const response = await fetch(path);
    if (response.status < 400) {
      const buffer = await response.arrayBuffer();
      const sound = await this.audio.decodeSound(id, buffer);

      if (sound) {
        if (keep) {
          this.sounds[id] = sound;
        }

        return sound;
      } else {
        throw new Error(`Unable to load sound ${id}.`);
      }
    } else {
      throw new Error(`Unable to load sound ${id}.`);
    }
  }

  addSound(id: string, sound: Sound): void {
    this.sounds[id] = sound;
  }

  getSound(id: string): Sound {
    if (this.sounds[id]) {
      return this.sounds[id];
    }

    throw new Error(`Sound "${id}" is not loaded.`);
  }

  unloadSound(id: string): void {
    if (this.sounds[id]) {
      delete this.sounds[id];
    }
  }

  async loadAtlas(id: string, path: string, keep = true): Promise<Atlas> {
    const image = await this.loadImage(`jume_atlas_${id}`, `${path}.png`, keep);
    const data = await this.loadText(`jume_atlas_${id}`, `${path}.json`, keep);

    const atlas = new Atlas(image, data);
    if (keep) {
      this.atlases[id] = atlas;
    }

    return atlas;
  }

  addAtlas(id: string, atlas: Atlas): void {
    this.atlases[id] = atlas;
  }

  getAtlas(id: string): Atlas {
    if (this.atlases[id]) {
      return this.atlases[id];
    }

    throw new Error(`Atlas "${id}" is not loaded.`);
  }

  unloadAtlas(id: string): void {
    if (this.atlases[id]) {
      delete this.atlases[id];
    }
  }
}
