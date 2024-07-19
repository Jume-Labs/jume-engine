import { Mat4 } from '../../math/mat4.js';
import { Vec3 } from '../../math/vec3.js';
import { Color } from '../color.js';
import { Context } from '../context.js';
import { shapeFrag, shapeVert } from '../defaultShaders.js';
import { Pipeline } from '../pipeline.js';
import { Shader } from '../shader.js';
import { LineAlign } from '../types.js';
import { BaseRenderer } from './baseRenderer.js';

const OFFSET = 7 * 3;
const VERTICES_PER_TRI = 3;

export class ShapeRenderer extends BaseRenderer {
  private index = 0;

  private p1: Vec3;

  private p2: Vec3;

  private p3: Vec3;

  constructor(context: Context) {
    super(context);

    this.p1 = new Vec3();
    this.p2 = new Vec3();
    this.p3 = new Vec3();

    this.vertexBuffer = context.gl.createBuffer()!;
    this.vertexIndices = new Float32Array(this.BUFFER_SIZE * OFFSET);

    this.indexBuffer = context.gl.createBuffer()!;
    this.indexIndices = new Int32Array(this.BUFFER_SIZE * VERTICES_PER_TRI);

    for (let i = 0; i < this.indexIndices.length; i++) {
      this.indexIndices[i * VERTICES_PER_TRI] = i * VERTICES_PER_TRI;
      this.indexIndices[i * VERTICES_PER_TRI + 1] = i * VERTICES_PER_TRI + 1;
      this.indexIndices[i * VERTICES_PER_TRI + 2] = i * VERTICES_PER_TRI + 2;
    }

    this.createDefaultPipeline();
  }

  present(): void {
    if (this.index === 0) {
      return;
    }
    this.pipeline.use();

    const gl = this.context.gl;
    gl.uniformMatrix4fv(this.pipeline.projectionLocation, false, this.projection.value);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexIndices, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexIndices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(this.pipeline.vertexPositionLocation, 3, gl.FLOAT, false, 7 * this.FLOAT_SIZE, 0);
    gl.enableVertexAttribArray(this.pipeline.vertexPositionLocation);

    gl.vertexAttribPointer(
      this.pipeline.vertexColorLocation,
      4,
      gl.FLOAT,
      false,
      7 * this.FLOAT_SIZE,
      3 * this.FLOAT_SIZE
    );
    gl.enableVertexAttribArray(this.pipeline.vertexColorLocation);

    gl.drawElements(gl.TRIANGLES, this.index * VERTICES_PER_TRI, gl.UNSIGNED_INT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.disableVertexAttribArray(this.pipeline.vertexPositionLocation);
    gl.disableVertexAttribArray(this.pipeline.vertexColorLocation);

    this.index = 0;
  }

  drawSolidTriangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    color: Color,
    transform: Mat4
  ): void {
    if (this.index >= this.BUFFER_SIZE) {
      this.present();
    }

    this.p1.transformMat4(transform, x1, y1, 0);
    this.p2.transformMat4(transform, x2, y2, 0);
    this.p3.transformMat4(transform, x3, y3, 0);

    this.setVertices(this.p1, this.p2, this.p3);
    this.setColor(color);
    this.index++;
  }

  drawSolidRect(x: number, y: number, width: number, height: number, color: Color, transform: Mat4): void {
    this.drawSolidTriangle(x, y, x + width, y, x, y + height, color, transform);
    this.drawSolidTriangle(x, y + height, x + width, y, x + width, y + height, color, transform);
  }

  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    lineWidth: number,
    color: Color,
    transform: Mat4
  ): void {
    // top
    this.drawLine(x, y, x + width, y, 'inside', lineWidth, color, transform);
    // right
    this.drawLine(x + width, y, x + width, y + height, 'inside', lineWidth, color, transform);
    // bottom
    this.drawLine(x + width, y + height, x, y + height, 'inside', lineWidth, color, transform);
    // left
    this.drawLine(x, y + height, x, y, 'inside', lineWidth, color, transform);
  }

  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    align: LineAlign,
    lineWidth: number,
    color: Color,
    transform: Mat4
  ): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const scale = lineWidth / (2 * lineLength);
    const ddx = -scale * dy;
    const ddy = scale * dx;
    switch (align) {
      case 'inside':
        this.drawSolidTriangle(x1, y1, x1 + ddx * 2, y1 + ddy * 2, x2, y2, color, transform);
        this.drawSolidTriangle(x2, y2, x1 + ddx * 2, y1 + ddy * 2, x2 + ddx * 2, y2 + ddy * 2, color, transform);
        break;

      case 'center':
        this.drawSolidTriangle(x1 + ddx, y1 + ddy, x1 - ddx, y1 - ddy, x2 + ddx, y2 + ddy, color, transform);
        this.drawSolidTriangle(x2 + ddx, y2 + ddy, x1 - ddx, y1 - ddy, x2 - ddx, y2 - ddy, color, transform);
        break;

      case 'outside':
        this.drawSolidTriangle(x1, y1, x1 - ddx * 2, y1 - ddy * 2, x2, y2, color, transform);
        this.drawSolidTriangle(x2, y2, x1 - ddx * 2, y1 - ddy * 2, x2 - ddx * 2, y2 - ddy * 2, color, transform);
        break;
    }
  }

  drawCircle(
    x: number,
    y: number,
    radius: number,
    segments: number,
    lineWidth: number,
    color: Color,
    transform: Mat4
  ): void {
    const theta = (2 * Math.PI) / segments;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    let sx = radius;
    let sy = 0.0;
    for (let i = 0; i < segments; i++) {
      const px = sx + x;
      const py = sy + y;
      const t = sx;
      sx = cos * sx - sin * sy;
      sy = cos * sy + sin * t;
      this.drawLine(sx + x, sy + y, px, py, 'inside', lineWidth, color, transform);
    }
  }

  drawSolidCircle(x: number, y: number, radius: number, segments: number, color: Color, transform: Mat4): void {
    const theta = (2 * Math.PI) / segments;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    let sx = radius;
    let sy = 0.0;
    for (let i = 0; i < segments; i++) {
      const px = sx + x;
      const py = sy + y;
      const t = sx;
      sx = cos * sx - sin * sy;
      sy = cos * sy + sin * t;
      this.drawSolidTriangle(px, py, sx + x, sy + y, x, y, color, transform);
    }
  }

  private setVertices(p1: Vec3, p2: Vec3, p3: Vec3): void {
    const i = this.index * OFFSET;
    this.vertexIndices[i] = p1.x;
    this.vertexIndices[i + 1] = p1.y;
    this.vertexIndices[i + 2] = 0;
    this.vertexIndices[i + 7] = p2.x;
    this.vertexIndices[i + 8] = p2.y;
    this.vertexIndices[i + 9] = 0;
    this.vertexIndices[i + 14] = p3.x;
    this.vertexIndices[i + 15] = p3.y;
    this.vertexIndices[i + 16] = 0;
  }

  private setColor(color: Color): void {
    const i = this.index * OFFSET;
    const red = color.red;
    const green = color.green;
    const blue = color.blue;
    const alpha = color.alpha;

    this.vertexIndices[i + 3] = red;
    this.vertexIndices[i + 4] = green;
    this.vertexIndices[i + 5] = blue;
    this.vertexIndices[i + 6] = alpha;
    this.vertexIndices[i + 10] = red;
    this.vertexIndices[i + 11] = green;
    this.vertexIndices[i + 12] = blue;
    this.vertexIndices[i + 13] = alpha;
    this.vertexIndices[i + 17] = red;
    this.vertexIndices[i + 18] = green;
    this.vertexIndices[i + 19] = blue;
    this.vertexIndices[i + 20] = alpha;
  }

  private createDefaultPipeline(): void {
    const vertexSource = shapeVert(this.context.isGL1);
    const vertexShader = new Shader(vertexSource, 'vertex');

    const fragmentSource = shapeFrag(this.context.isGL1);
    const fragmentShader = new Shader(fragmentSource, 'fragment');

    this.defaultPipeline = new Pipeline(vertexShader, fragmentShader, false);
    this.pipeline = this.defaultPipeline;
  }
}
