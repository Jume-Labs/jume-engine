import { inject } from 'src/di/inject';
import { Context } from './context';
import { Shader } from './shader';
import { BlendMode, BlendOperation } from './types';

export class Pipeline {
  blendSource: BlendMode;

  blendDestination: BlendMode;

  blendOperation: BlendOperation;

  alphaBlendSource: BlendMode;

  alphaBlendDestination: BlendMode;

  alphaBlendOperation: BlendOperation;

  projectionLocation: WebGLUniformLocation;

  textureLocation: WebGLUniformLocation | null;

  vertexPositionLocation = 0;

  vertexColorLocation = 1;

  vertexUVLocation = 2;

  private vertexShader: Shader;

  private fragmentShader: Shader;

  private program: WebGLProgram;

  @inject
  private context!: Context;

  constructor(vertexShader: Shader, fragmentShader: Shader, useTexture: boolean) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.program = this.createProgram(useTexture)!;

    const projection = this.getUniformLocation('projectionMatrix');
    if (!projection) {
      throw new Error('projectionMatrix not available in the vertex shader');
    }
    this.projectionLocation = projection;

    this.textureLocation = null;
    if (useTexture) {
      const tex = this.getUniformLocation('tex');
      if (!tex) {
        throw new Error('tex not available in the fragment shader');
      }
      this.textureLocation = tex;
    }

    this.blendSource = 'blend one';
    this.blendDestination = 'inverse source alpha';
    this.blendOperation = 'add';

    this.alphaBlendSource = 'blend one';
    this.alphaBlendDestination = 'inverse source alpha';
    this.alphaBlendOperation = 'add';
  }

  use() {
    this.context.gl.useProgram(this.program);
  }

  getUniformLocation(location: string): WebGLUniformLocation | null {
    return this.context.gl.getUniformLocation(this.program, location);
  }

  private createProgram(useTexture: boolean): WebGLProgram | null {
    const gl = this.context.gl;
    const program = gl.createProgram();
    if (program) {
      gl.attachShader(program, this.vertexShader.glShader);
      gl.attachShader(program, this.fragmentShader.glShader);
      gl.linkProgram(program);

      const success: boolean = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!success) {
        let error = gl.getProgramInfoLog(program);
        throw new Error(`Error while linking shader program: ${error}`);
      }

      gl.bindAttribLocation(program, this.vertexPositionLocation, 'vertexPosition');
      gl.bindAttribLocation(program, this.vertexColorLocation, 'vertexColor');

      if (useTexture) {
        gl.bindAttribLocation(program, this.vertexUVLocation, 'vertexUV');
      }

      return program;
    } else {
      throw new Error('Unable to create shader program');
    }
  }
}
