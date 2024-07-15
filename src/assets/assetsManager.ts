import { AudioManager } from '../audio/audioManager.js';
import { Sound } from '../audio/sound.js';
import { inject } from '../di/inject.js';
import { Atlas } from '../graphics/atlas.js';
import { BitmapFont } from '../graphics/bitmapFont.js';
import { Context } from '../graphics/context.js';
import { Image } from '../graphics/image.js';
import { Shader } from '../graphics/shader.js';
import { ShaderType } from '../graphics/types.js';

export abstract class AssetLoader<T> {
  readonly assetType: new (...args: any[]) => T;

  protected manager: AssetManager;

  protected loadedAssets: Record<string, T> = {};

  constructor(assetType: new (...args: any[]) => T, manager: AssetManager) {
    this.assetType = assetType;
    this.manager = manager;
  }

  abstract load(id: string, path: string, props?: unknown, keep?: boolean): Promise<T>;

  add(id: string, instance: T): void {
    this.loadedAssets[id] = instance;
  }

  get(id: string): T {
    if (this.loadedAssets[id]) {
      return this.loadedAssets[id];
    }

    throw new Error(`Asset with id "${id}" not loaded`);
  }

  unload(id: string): boolean {
    if (this.loadedAssets[id]) {
      delete this.loadedAssets[id];
    }
    return true;
  }
}

/**
 * Class to load and store assets.
 */
export class AssetManager {
  private readonly loaders = new Map<new (...args: any[]) => unknown, AssetLoader<unknown>>();

  constructor() {}

  registerBuiltinLoaders(): void {
    this.registerLoader(new ImageLoader(this));
    this.registerLoader(new TextLoader(this));
    this.registerLoader(new BitmapFontLoader(this));
    this.registerLoader(new ShaderLoader(this));
    this.registerLoader(new SoundLoader(this));
    this.registerLoader(new AtlasLoader(this));
  }

  registerLoader<T>(loader: AssetLoader<T>): void {
    this.loaders.set(loader.assetType, loader);
  }

  async loadAsset<T>(
    type: new (...args: any[]) => T,
    id: string,
    path: string,
    props?: unknown,
    keep = true
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.loaders.has(type)) {
        this.loaders
          .get(type)!
          .load(id, path, props, keep)
          .then((value) => {
            resolve(value as T);
          })
          .catch((reason) => {
            reject(reason);
          });
      } else {
        reject('Loader is not registered for type');
      }
    });
  }

  addAsset<T>(type: new (...args: any[]) => T, id: string, instance: T): void {
    if (this.loaders.has(type)) {
      this.loaders.get(type)!.add(id, instance);
    } else {
      throw new Error('Loader is not registered for type');
    }
  }

  getAsset<T>(type: new (...args: any[]) => T, id: string): T {
    if (this.loaders.has(type)) {
      return this.loaders.get(type)!.get(id) as T;
    }

    throw new Error('Loader is not registered for type');
  }

  unloadAsset<T>(type: new (...args: any[]) => T, id: string): boolean {
    if (this.loaders.has(type)) {
      return this.loaders.get(type)!.unload(id);
    } else {
      throw new Error('Loader is not registered for type');
    }
  }
}

class ImageLoader extends AssetLoader<Image> {
  constructor(manager: AssetManager) {
    super(Image, manager);
  }

  async load(id: string, path: string, _props?: unknown, keep = true): Promise<Image> {
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
            this.loadedAssets[id] = image;
          }
          resolve(image);
        } else {
          reject(`Unable to load image "${path}".`);
        }
      };

      element.onerror = (): void => {
        reject(`Unable to load image "${path}".`);
      };

      element.src = path;
    });
  }

  override unload(id: string): boolean {
    const image = this.loadedAssets[id];
    if (image) {
      image.destroy();
      return super.unload(id);
    }

    return false;
  }
}

class TextLoader extends AssetLoader<String> {
  constructor(manager: AssetManager) {
    super(String, manager);
  }

  async load(id: string, path: string, _props?: unknown, keep = true): Promise<String> {
    const response = await fetch(path);
    if (response.status < 400) {
      const text = new String(await response.text());
      if (keep) {
        this.loadedAssets[id] = text;
      }

      return text;
    } else {
      throw new Error(`Unable to load text ${path}.`);
    }
  }
}

class BitmapFontLoader extends AssetLoader<BitmapFont> {
  constructor(manager: AssetManager) {
    super(BitmapFont, manager);
  }

  async load(id: string, path: string, _props?: unknown, keep = true): Promise<BitmapFont> {
    const image = await this.manager.loadAsset(Image, `jume_bitmap_font_${id}`, `${path}.png`, undefined, keep);
    const data = await this.manager.loadAsset(String, `jume_bitmap_font_${id}`, `${path}.fnt`, undefined, keep);

    const font = new BitmapFont(image, data.valueOf());
    if (keep) {
      this.loadedAssets[id] = font;
    }

    return font;
  }

  override unload(id: string): boolean {
    if (this.loadedAssets[id]) {
      this.manager.unloadAsset(Image, `jume_bitmap_fot_${id}`);
      this.manager.unloadAsset(String, `jume_bitmap_font_${id}`);
    }

    return super.unload(id);
  }
}

class ShaderLoader extends AssetLoader<Shader> {
  @inject
  private context!: Context;

  constructor(manager: AssetManager) {
    super(Shader, manager);
  }

  async load(id: string, path: string, _props?: unknown, keep = true): Promise<Shader> {
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

    const source = await this.manager.loadAsset(String, `jume_shader_${id}`, path, undefined, false);
    const shader = new Shader(source.valueOf(), shaderType);

    if (keep) {
      this.loadedAssets[id] = shader;
    }

    return shader;
  }

  override unload(id: string): boolean {
    const shader = this.loadedAssets[id];
    if (shader) {
      shader.destroy();
      return super.unload(id);
    }

    return false;
  }
}

class SoundLoader extends AssetLoader<Sound> {
  @inject
  audioManager!: AudioManager;

  constructor(manager: AssetManager) {
    super(Sound, manager);
  }

  async load(id: string, path: string, _props?: unknown, keep?: boolean): Promise<Sound> {
    const response = await fetch(path);
    if (response.status < 400) {
      const buffer = await response.arrayBuffer();
      const sound = await this.audioManager.decodeSound(id, buffer);

      if (sound) {
        if (keep) {
          this.loadedAssets[id] = sound;
        }

        return sound;
      } else {
        throw new Error(`Unable to load sound ${id}.`);
      }
    } else {
      throw new Error(`Unable to load sound ${id}.`);
    }
  }
}

class AtlasLoader extends AssetLoader<Atlas> {
  constructor(manager: AssetManager) {
    super(Atlas, manager);
  }

  async load(id: string, path: string, _props?: unknown, keep?: boolean): Promise<Atlas> {
    const image = await this.manager.loadAsset(Image, `jume_atlas_${id}`, `${path}.png`, undefined, keep);
    const data = await this.manager.loadAsset(String, `jume_atlas_${id}`, `${path}.json`, undefined, keep);

    const atlas = new Atlas(image, data.valueOf());
    if (keep) {
      this.loadedAssets[id] = atlas;
    }

    return atlas;
  }

  override unload(id: string): boolean {
    if (this.loadedAssets[id]) {
      this.manager.unloadAsset(Image, `jume_atlas_${id}`);
      this.manager.unloadAsset(String, `jume_atlas_${id}`);

      return super.unload(id);
    }

    return false;
  }
}
