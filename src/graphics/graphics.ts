import { Mat4 } from 'src/math/mat4';
import { View } from 'src/view/view';

import { BitmapFont } from './bitmapFont';
import { Color } from './color';
import { Context } from './context';
import { Image } from './image';
import { Pipeline } from './pipeline';
import { ImageRenderer } from './renderers/imageRenderer';
import { ShapeRenderer } from './renderers/shapeRenderer';
import { RenderTarget } from './renderTarget';
import { BlendMode, BlendOperation, LineAlign, MipmapFilter, TextureFilter, TextureWrap } from './types';

const MAX_TARGET_STACK = 64;
const MAX_TRANSFORM_STACK = 128;

export class Graphics {
  color = new Color(1, 1, 1, 1);

  transformStack: Mat4[] = [];

  get transform(): Mat4 {
    return this.transformStack[this.transformStack.length - 1];
  }

  private shapeRenderer: ShapeRenderer;

  private imageRenderer: ImageRenderer;

  private targetStack: RenderTarget[] = [];

  private clearColor = new Color(0, 0, 0, 1);

  private projection: Mat4;

  private view: View;

  private context: Context;

  constructor(context: Context, view: View) {
    this.context = context;
    this.view = view;

    this.projection = new Mat4();
    this.transformStack.push(new Mat4());

    this.setBlendMode('blend one', 'inverse source alpha', 'add', 'blend one', 'inverse source alpha', 'add');
    this.shapeRenderer = new ShapeRenderer(context);
    this.imageRenderer = new ImageRenderer(context);
  }

  setBlendMode(
    source: BlendMode,
    destination: BlendMode,
    operation: BlendOperation,
    alphaSource: BlendMode,
    alphaDestination: BlendMode,
    alphaOperation: BlendOperation
  ): void {
    const gl = this.context.gl;
    if (source === 'blend one' && destination === 'blend zero') {
      gl.disable(gl.BLEND);
    } else {
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(
        this.context.getGLBlendMode(source),
        this.context.getGLBlendMode(destination),
        this.context.getGLBlendMode(alphaSource),
        this.context.getGLBlendMode(alphaDestination)
      );
      gl.blendEquationSeparate(
        this.context.getGLBlendOperation(operation),
        this.context.getGLBlendOperation(alphaOperation)
      );
    }
  }

  setTextureParameters(
    textUnit: number,
    uWrap: TextureWrap,
    vWrap: TextureWrap,
    minFilter: TextureFilter,
    magFilter: TextureFilter,
    mipmapFilter: MipmapFilter
  ): void {
    this.imageRenderer.setTextureParameters(textUnit, uWrap, vWrap, minFilter, magFilter, mipmapFilter);
  }

  pushTarget(target: RenderTarget): void {
    if (this.targetStack.length === MAX_TARGET_STACK) {
      throw new Error('Render target stack size exceeded. (more pushes than pulls?)');
    }

    this.targetStack.push(target);
    this.context.gl.bindFramebuffer(this.context.gl.FRAMEBUFFER, target.buffer);
  }

  popTarget(): void {
    this.targetStack.pop();
    const gl = this.context.gl;

    if (this.targetStack.length > 0) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetStack[this.targetStack.length - 1].buffer);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  }

  clearTargets(): void {
    while (this.targetStack.length > 0) {
      this.targetStack.pop();
    }
    this.context.gl.bindFramebuffer(this.context.gl.FRAMEBUFFER, null);
  }

  pushTransform(transform?: Mat4): void {
    if (this.transformStack.length === MAX_TRANSFORM_STACK) {
      throw new Error('Transform stack size exceeded. (more pushes than pulls?)');
    }

    if (!transform) {
      this.transformStack.push(Mat4.get(this.transform.value));
    } else {
      this.transformStack.push(Mat4.get(transform.value));
    }
  }

  applyTransform(transform: Mat4): void {
    Mat4.multiply(this.transform, transform, this.transform);
  }

  popTransform(): void {
    if (this.transformStack.length <= 1) {
      throw new Error('Cannot pop the last transform off the stack');
    }

    this.transformStack.pop()?.put();
  }

  start(clear?: boolean, clearColor?: Color): void {
    const gl = this.context.gl;
    if (this.targetStack.length > 0) {
      const target = this.targetStack[this.targetStack.length - 1];
      this.projection.ortho(0, target.width, target.height, 0, 0, 1000);
      gl.viewport(0, 0, target.width, target.height);
    } else {
      const width = this.view.canvasWidth;
      const height = this.view.canvasHeight;
      this.projection.ortho(0, width, height, 0, 0, 1000);
      gl.viewport(0, 0, width, height);
    }

    this.shapeRenderer.setProjection(this.projection);
    this.imageRenderer.setProjection(this.projection);

    if (clear) {
      if (clearColor) {
        gl.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearColor.alpha);
      } else {
        gl.clearColor(this.clearColor.red, this.clearColor.green, this.clearColor.blue, this.clearColor.alpha);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }

  present(): void {
    this.shapeRenderer.present();
    this.imageRenderer.present();
  }

  setPipeline(pipeline?: Pipeline): void {
    if (pipeline) {
      this.setBlendMode(
        pipeline.blendSource,
        pipeline.blendDestination,
        pipeline.blendOperation,
        pipeline.alphaBlendSource,
        pipeline.alphaBlendDestination,
        pipeline.alphaBlendOperation
      );
      pipeline.use();
    }

    this.shapeRenderer.setPipeline(pipeline);
    this.imageRenderer.setPipeline(pipeline);
  }

  drawSolidTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
    this.imageRenderer.present();
    this.shapeRenderer.drawSolidTriangle(x1, y1, x2, y2, x3, y3, this.color, this.transform);
  }

  drawSolidRect(x: number, y: number, width: number, height: number): void {
    this.imageRenderer.present();
    this.shapeRenderer.drawSolidRect(x, y, width, height, this.color, this.transform);
  }

  drawRect(x: number, y: number, width: number, height: number, lineWidth = 1): void {
    this.imageRenderer.present();
    this.shapeRenderer.drawRect(x, y, width, height, lineWidth, this.color, this.transform);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, align: LineAlign, lineWidth = 1): void {
    this.imageRenderer.present();
    this.shapeRenderer.drawLine(x1, y1, x2, y2, align, lineWidth, this.color, this.transform);
  }

  drawSolidCircle(x: number, y: number, radius: number, segments = 32): void {
    this.imageRenderer.present();
    this.shapeRenderer.drawSolidCircle(x, y, radius, segments, this.color, this.transform);
  }

  drawCircle(x: number, y: number, radius: number, segments = 32, lineWidth = 1): void {
    this.imageRenderer.present();
    this.shapeRenderer.drawCircle(x, y, radius, segments, lineWidth, this.color, this.transform);
  }

  drawImage(x: number, y: number, image: Image, flipX = false, flipY = false): void {
    this.shapeRenderer.present();
    this.imageRenderer.drawImage(x, y, flipX, flipY, image, this.color, this.transform);
  }

  drawScaledImage(
    x: number,
    y: number,
    width: number,
    height: number,
    image: Image,
    flipX = false,
    flipY = false
  ): void {
    this.shapeRenderer.present();
    this.imageRenderer.drawScaledImage(x, y, width, height, flipX, flipY, image, this.color, this.transform);
  }

  drawImageSection(
    x: number,
    y: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    image: Image,
    flipX = false,
    flipY = false
  ): void {
    this.shapeRenderer.present();
    this.imageRenderer.drawImageSection(x, y, sx, sy, sw, sh, flipX, flipY, image, this.color, this.transform);
  }

  drawScaledImageSection(
    x: number,
    y: number,
    width: number,
    height: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    image: Image,
    flipX = false,
    flipY = false
  ): void {
    this.shapeRenderer.present();
    this.imageRenderer.drawScaledImageSection(
      x,
      y,
      width,
      height,
      sx,
      sy,
      sw,
      sh,
      flipX,
      flipY,
      image,
      this.color,
      this.transform
    );
  }

  drawImagePoints(
    tlX: number,
    tlY: number,
    trX: number,
    trY: number,
    brX: number,
    brY: number,
    blX: number,
    blY: number,
    image: Image
  ): void {
    this.shapeRenderer.present();
    this.imageRenderer.drawImagePoints(tlX, tlY, trX, trY, brX, brY, blX, blY, image, this.color, this.transform);
  }

  drawImageSectionPoints(
    tlX: number,
    tlY: number,
    trX: number,
    trY: number,
    brX: number,
    brY: number,
    blX: number,
    blY: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    image: Image
  ): void {
    this.shapeRenderer.present();
    this.imageRenderer.drawImageSectionPoints(
      tlX,
      tlY,
      trX,
      trY,
      brX,
      brY,
      blX,
      blY,
      sx,
      sy,
      sw,
      sh,
      image,
      this.color,
      this.transform
    );
  }

  drawRenderTarget(x: number, y: number, target: RenderTarget): void {
    this.shapeRenderer.present();
    this.imageRenderer.drawRenderTarget(x, y, target, this.color, this.transform);
  }

  drawBitmapText(x: number, y: number, font: BitmapFont, text: string): void {
    this.shapeRenderer.present();
    this.imageRenderer.drawBitmapText(x, y, font, text, this.color, this.transform);
  }

  setBool(location: WebGLUniformLocation | null, value: boolean): void {
    this.context.gl.uniform1i(location, value ? 1 : 0);
  }

  setInt(location: WebGLUniformLocation | null, value: number): void {
    this.context.gl.uniform1i(location, value);
  }

  setInt2(location: WebGLUniformLocation | null, value1: number, value2: number): void {
    this.context.gl.uniform2i(location, value1, value2);
  }

  setInt3(location: WebGLUniformLocation | null, value1: number, value2: number, value3: number): void {
    this.context.gl.uniform3i(location, value1, value2, value3);
  }

  setInt4(location: WebGLUniformLocation | null, value1: number, value2: number, value3: number, value4: number): void {
    this.context.gl.uniform4i(location, value1, value2, value3, value4);
  }

  setInts(location: WebGLUniformLocation | null, value: Int32Array): void {
    this.context.gl.uniform1iv(location, value);
  }

  setFloat(location: WebGLUniformLocation | null, value: number): void {
    this.context.gl.uniform1f(location, value);
  }

  setFloat2(location: WebGLUniformLocation | null, value1: number, value2: number): void {
    this.context.gl.uniform2f(location, value1, value2);
  }

  setFloat3(location: WebGLUniformLocation | null, value1: number, value2: number, value3: number): void {
    this.context.gl.uniform3f(location, value1, value2, value3);
  }

  setFloat4(
    location: WebGLUniformLocation | null,
    value1: number,
    value2: number,
    value3: number,
    value4: number
  ): void {
    this.context.gl.uniform4f(location, value1, value2, value3, value4);
  }

  setFloats(location: WebGLUniformLocation | null, value: Float32Array): void {
    this.context.gl.uniform1fv(location, value);
  }

  setMatrix(location: WebGLUniformLocation | null, value: Mat4): void {
    this.context.gl.uniformMatrix4fv(location, false, value.value);
  }

  setTexture(unit: number, value?: Image): void {
    const gl = this.context.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    if (value) {
      gl.bindTexture(gl.TEXTURE_2D, value.texture);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }
}
