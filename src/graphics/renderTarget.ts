import { inject } from '../di/inject.js';
import { Mat4 } from '../math/mat4.js';
import { Context } from './context.js';
import { TextureFilter, TextureWrap } from './types.js';

export class RenderTarget {
  readonly width: number;

  readonly height: number;

  projection: Mat4;

  texture: WebGLTexture | null;

  buffer: WebGLFramebuffer | null;

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

  private _magFilter: TextureFilter;

  private _minFilter: TextureFilter;

  private _uWrap: TextureWrap;

  private _vWrap: TextureWrap;

  @inject
  private context!: Context;

  constructor(
    width: number,
    height: number,
    magFilter: TextureFilter = 'linear',
    minFilter: TextureFilter = 'linear',
    uWrap: TextureWrap = 'clamp to edge',
    vWrap: TextureWrap = 'clamp to edge'
  ) {
    this.width = width;
    this.height = height;
    this._magFilter = magFilter;
    this._minFilter = minFilter;
    this._uWrap = uWrap;
    this._vWrap = vWrap;

    this.projection = new Mat4();
    this.projection.ortho(0, width, height, 0, 0, 1000);

    const gl = this.context.gl;
    this.buffer = gl.createFramebuffer();
    this.texture = gl.createTexture();

    const tex2d = gl.TEXTURE_2D;
    gl.bindTexture(tex2d, this.texture);
    gl.texImage2D(tex2d, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.context.getGLTextureFilter(magFilter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.context.getGLTextureFilter(minFilter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.context.getGLTextureWrap(uWrap));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.context.getGLTextureWrap(vWrap));

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, tex2d, this.texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  destroy(): void {
    const gl = this.context.gl;
    gl.deleteTexture(this.texture);
    this.texture = null;

    gl.deleteFramebuffer(this.buffer);
    this.buffer = null;
  }
}
