import { Mat4 } from '../../math/mat4.js';
import { Context } from '../context.js';
import { Pipeline } from '../pipeline.js';

export class BaseRenderer {
  protected readonly BUFFER_SIZE = 4000;

  protected readonly FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT;

  protected pipeline!: Pipeline;

  protected defaultPipeline!: Pipeline;

  protected projection: Mat4;

  protected vertexBuffer!: WebGLBuffer;

  protected indexBuffer!: WebGLBuffer;

  protected vertexIndices!: Float32Array;

  protected indexIndices!: Int32Array;

  protected context: Context;

  constructor(context: Context) {
    this.context = context;
    this.projection = new Mat4();
  }

  setProjection(projection: Mat4): void {
    this.projection = projection;
  }

  setPipeline(pipeline?: Pipeline): void {
    if (!pipeline) {
      this.pipeline = this.defaultPipeline;
    } else {
      this.pipeline = pipeline;
    }
  }
}
