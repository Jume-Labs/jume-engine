import { inject } from 'src/di/inject';

import { Context } from './context';
import { TextureFilter, TextureWrap } from './types';

export class Image {
  readonly width: number;

  readonly height: number;

  readonly data: Uint8Array;

  get texture(): WebGLTexture {
    return this._texture;
  }

  get magFilter(): TextureFilter {
    return this._magFilter;
  }

  get minFilter(): TextureFilter {
    return this._minFilter;
  }

  get uWrap(): TextureWrap {
    return this._uWrap;
  }

  get vWrap(): TextureWrap {
    return this._vWrap;
  }

  private _texture: WebGLTexture;

  private _magFilter: TextureFilter = 'linear';

  private _minFilter: TextureFilter = 'linear';

  private _uWrap: TextureWrap = 'clamp to edge';

  private _vWrap: TextureWrap = 'clamp to edge';

  @inject
  private context!: Context;

  constructor(width: number, height: number, data: Uint8Array) {
    this.width = width;
    this.height = height;
    this.data = data;

    this._texture = this.createTexture();
    this.updateTexture();
  }

  updateTexture(
    magFilter: TextureFilter = 'linear',
    minFilter: TextureFilter = 'linear',
    uWrap: TextureWrap = 'clamp to edge',
    vWrap: TextureWrap = 'clamp to edge'
  ): void {
    if (!this._texture) {
      return;
    }

    this._magFilter = magFilter;
    this._minFilter = minFilter;
    this._uWrap = uWrap;
    this._vWrap = vWrap;

    const gl = this.context.gl;

    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.context.getGLTextureFilter(magFilter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.context.getGLTextureFilter(minFilter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.context.getGLTextureWrap(uWrap));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.context.getGLTextureWrap(vWrap));

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.data);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  destroy(): void {
    this.context.gl.deleteTexture(this._texture);
  }

  private createTexture(): WebGLTexture {
    const gl = this.context.gl;
    if (this._texture) {
      gl.deleteTexture(this._texture);
    }

    return gl.createTexture()!;
  }
}
