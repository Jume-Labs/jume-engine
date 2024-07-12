import { BlendMode, BlendOperation, MipmapFilter, TextureFilter, TextureWrap } from './types.js';

export class Context {
  readonly isGL1: boolean;

  gl: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement, forceGL1: boolean) {
    let isGL1 = false;

    const attributes: WebGLContextAttributes = {
      alpha: false,
      antialias: true,
    };

    let context = forceGL1 ? null : canvas.getContext('webgl2', attributes);

    if (!context) {
      context = canvas.getContext('webgl', attributes) as WebGL2RenderingContext;
      if (!context) {
        throw new Error('Unable to initialize WEBGL context.');
      }
      isGL1 = true;
    }

    this.gl = context;

    this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    this.gl.getExtension('OES_texture_float_linear');
    this.gl.getExtension('OES_texture_half_float_linear');

    if (isGL1) {
      this.gl.getExtension('OES_texture_float');
      this.gl.getExtension('EXT_shader_texture_lod');
      this.gl.getExtension('OES_standard_derivatives');
    } else {
      this.gl.getExtension('EXT_color_buffer_float');
    }

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.isGL1 = isGL1;
  }

  getGLBlendMode(mode: BlendMode): number {
    switch (mode) {
      case 'blend zero':
        return this.gl.ZERO;

      case 'blend one':
        return this.gl.ONE;

      case 'undefined':
        return this.gl.ZERO;

      case 'source alpha':
        return this.gl.SRC_ALPHA;

      case 'destination alpha':
        return this.gl.DST_ALPHA;

      case 'inverse source alpha':
        return this.gl.ONE_MINUS_SRC_ALPHA;

      case 'inverse destination alpha':
        return this.gl.ONE_MINUS_DST_ALPHA;

      case 'source color':
        return this.gl.SRC_COLOR;

      case 'destination color':
        return this.gl.DST_COLOR;

      case 'inverse source color':
        return this.gl.ONE_MINUS_SRC_COLOR;

      case 'inverse destination color':
        return this.gl.ONE_MINUS_DST_COLOR;
    }
  }

  getGLBlendOperation(operation: BlendOperation): number {
    switch (operation) {
      case 'add':
        return this.gl.FUNC_ADD;

      case 'subtract':
        return this.gl.FUNC_SUBTRACT;

      case 'reverse subtract':
        return this.gl.FUNC_REVERSE_SUBTRACT;
    }
  }

  getGLTextureWrap(wrap: TextureWrap): number {
    switch (wrap) {
      case 'clamp to edge':
        return this.gl.CLAMP_TO_EDGE;

      case 'repeat':
        return this.gl.REPEAT;

      case 'mirrored repeat':
        return this.gl.MIRRORED_REPEAT;
    }
  }

  getGLTextureFilter(filter: TextureFilter, mipmap: MipmapFilter = 'none'): number {
    switch (filter) {
      case 'nearest':
        switch (mipmap) {
          case 'none':
            return this.gl.NEAREST;

          case 'nearest':
            return this.gl.NEAREST_MIPMAP_NEAREST;

          case 'linear':
            return this.gl.NEAREST_MIPMAP_LINEAR;
        }

      case 'linear':
        switch (mipmap) {
          case 'none':
            return this.gl.LINEAR;

          case 'nearest':
            return this.gl.LINEAR_MIPMAP_NEAREST;

          case 'linear':
            return this.gl.LINEAR_MIPMAP_LINEAR;
        }

      case 'anisotropic':
        switch (mipmap) {
          case 'none':
            return this.gl.LINEAR;

          case 'nearest':
            return this.gl.LINEAR_MIPMAP_NEAREST;

          case 'linear':
            return this.gl.LINEAR_MIPMAP_LINEAR;
        }
    }
  }
}
