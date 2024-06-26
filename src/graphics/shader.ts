import { inject } from 'src/di/inject';
import { Context } from './context';
import { ShaderType } from './types';

export class Shader {
  readonly glShader: WebGLShader;

  @inject
  private context!: Context;

  constructor(source: string, type: ShaderType) {
    const gl = this.context.gl;
    const shaderType = type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    const shader = gl.createShader(shaderType);
    if (!shader) {
      throw new Error(`Unable to load shader:\n ${source}`);
    }
    this.glShader = shader;

    gl.shaderSource(this.glShader, source);
    gl.compileShader(this.glShader);
    if (!gl.getShaderParameter(this.glShader, gl.COMPILE_STATUS)) {
      throw new Error(`Could not compile shader:\n ${gl.getShaderInfoLog(this.glShader)}`);
    }
  }

  destroy() {
    this.context.gl.deleteShader(this.glShader);
  }
}
