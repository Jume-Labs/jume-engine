import { Mat4 } from '../../math/mat4.js';
import { Vec3 } from '../../math/vec3.js';
import { BitmapFont } from '../bitmapFont.js';
import { Color } from '../color.js';
import { Context } from '../context.js';
import { imageFrag, imageVert } from '../defaultShaders.js';
import { Image } from '../image.js';
import { Pipeline } from '../pipeline.js';
import { RenderTarget } from '../renderTarget.js';
import { Shader } from '../shader.js';
import { MipmapFilter, TextureFilter, TextureWrap } from '../types.js';
import { BaseRenderer } from './baseRenderer.js';

const OFFSET = 9 * 4;
const VERTICES_PER_QUAD = 4;
const INDICES_PER_QUAD = 6;

export class ImageRenderer extends BaseRenderer {
  private index = 0;

  private p1: Vec3;
  private p2: Vec3;
  private p3: Vec3;
  private p4: Vec3;

  private image?: Image;

  private target?: RenderTarget;

  private anisotropicFilter: EXT_texture_filter_anisotropic | null;

  constructor(context: Context) {
    super(context);

    this.anisotropicFilter = context.gl.getExtension('EXT_texture_filter_anisotropic');

    this.p1 = new Vec3();
    this.p2 = new Vec3();
    this.p3 = new Vec3();
    this.p4 = new Vec3();

    this.vertexBuffer = context.gl.createBuffer()!;
    this.vertexIndices = new Float32Array(this.BUFFER_SIZE * OFFSET);

    this.indexBuffer = context.gl.createBuffer()!;
    this.indexIndices = new Int32Array(this.BUFFER_SIZE * INDICES_PER_QUAD);

    for (let i = 0; i < this.indexIndices.length; i++) {
      this.indexIndices[i * INDICES_PER_QUAD] = i * VERTICES_PER_QUAD;
      this.indexIndices[i * INDICES_PER_QUAD + 1] = i * VERTICES_PER_QUAD + 1;
      this.indexIndices[i * INDICES_PER_QUAD + 2] = i * VERTICES_PER_QUAD + 2;
      this.indexIndices[i * INDICES_PER_QUAD + 3] = i * VERTICES_PER_QUAD;
      this.indexIndices[i * INDICES_PER_QUAD + 4] = i * VERTICES_PER_QUAD + 2;
      this.indexIndices[i * INDICES_PER_QUAD + 5] = i * VERTICES_PER_QUAD + 3;
    }
    this.createDefaultPipeline();
  }

  present(): void {
    if (this.index === 0 || (!this.target && !this.image)) {
      return;
    }

    this.pipeline.use();

    const gl = this.context.gl;
    gl.uniformMatrix4fv(this.pipeline.projectionLocation, false, this.projection.value);
    gl.activeTexture(gl.TEXTURE0);
    if (this.target) {
      gl.bindTexture(gl.TEXTURE_2D, this.target.texture);
      this.setTextureParameters(
        0,
        this.target.uWrap,
        this.target.vWrap,
        this.target.minFilter,
        this.target.magFilter,
        'none'
      );
    } else if (this.image) {
      gl.bindTexture(gl.TEXTURE_2D, this.image.texture);
      this.setTextureParameters(
        0,
        this.image.uWrap,
        this.image.vWrap,
        this.image.minFilter,
        this.image.magFilter,
        'none'
      );
      if (this.pipeline.textureLocation) {
        gl.uniform1i(this.pipeline.textureLocation, 0);
      } else {
        return;
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexIndices, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexIndices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(this.pipeline.vertexPositionLocation, 3, gl.FLOAT, false, this.FLOAT_SIZE * 9, 0);
    gl.enableVertexAttribArray(this.pipeline.vertexPositionLocation);
    gl.vertexAttribPointer(
      this.pipeline.vertexColorLocation,
      4,
      gl.FLOAT,
      false,
      this.FLOAT_SIZE * 9,
      this.FLOAT_SIZE * 3
    );
    gl.enableVertexAttribArray(this.pipeline.vertexColorLocation);
    gl.vertexAttribPointer(
      this.pipeline.vertexUVLocation,
      2,
      gl.FLOAT,
      false,
      this.FLOAT_SIZE * 9,
      this.FLOAT_SIZE * 7
    );
    gl.enableVertexAttribArray(this.pipeline.vertexUVLocation);

    gl.drawElements(gl.TRIANGLES, this.index * INDICES_PER_QUAD, gl.UNSIGNED_INT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.disableVertexAttribArray(this.pipeline.vertexPositionLocation);
    gl.disableVertexAttribArray(this.pipeline.vertexColorLocation);
    gl.disableVertexAttribArray(this.pipeline.vertexUVLocation);

    this.index = 0;
    this.image = undefined;
    this.target = undefined;
  }

  drawImage(x: number, y: number, flipX: boolean, flipY: boolean, image: Image, color: Color, transform: Mat4): void {
    this.drawImageSection(x, y, 0, 0, image.width, image.height, flipX, flipY, image, color, transform);
  }

  drawScaledImage(
    x: number,
    y: number,
    width: number,
    height: number,
    flipX: boolean,
    flipY: boolean,
    image: Image,
    color: Color,
    transform: Mat4
  ): void {
    this.drawScaledImageSection(
      x,
      y,
      width,
      height,
      0,
      0,
      image.width,
      image.height,
      flipX,
      flipY,
      image,
      color,
      transform
    );
  }

  drawImageSection(
    x: number,
    y: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    flipX: boolean,
    flipY: boolean,
    image: Image,
    color: Color,
    transform: Mat4
  ): void {
    this.drawScaledImageSection(x, y, sw, sh, sx, sy, sw, sh, flipX, flipY, image, color, transform);
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
    flipX: boolean,
    flipY: boolean,
    image: Image,
    color: Color,
    transform: Mat4
  ): void {
    if (this.index >= this.BUFFER_SIZE || this.target || (this.image && this.image !== image)) {
      this.present();
    }

    this.image = image;
    this.p1.transformMat4(transform, x, y, 0);
    this.p2.transformMat4(transform, x + width, y, 0);
    this.p3.transformMat4(transform, x + width, y + height, 0);
    this.p4.transformMat4(transform, x, y + height, 0);

    const textureWidth = image.width;
    const textureHeight = image.height;
    this.setVertices(this.p1, this.p2, this.p3, this.p4);
    this.setColor(color);

    if (flipX && flipY) {
      this.setTextureCoords(
        (sx + sw) / textureWidth,
        (sy + sh) / textureHeight,
        sx / textureWidth,
        (sy + sh) / textureHeight,
        sx / textureWidth,
        sy / textureHeight,
        (sx + sw) / textureWidth,
        sy / textureHeight
      );
    } else if (flipX) {
      this.setTextureCoords(
        sx / textureWidth,
        (sy + sh) / textureHeight,
        (sx + sw) / textureWidth,
        (sy + sh) / textureHeight,
        (sx + sw) / textureWidth,
        sy / textureHeight,
        sx / textureWidth,
        sy / textureHeight
      );
    } else if (flipY) {
      this.setTextureCoords(
        (sx + sw) / textureWidth,
        sy / textureHeight,
        sx / textureWidth,
        sy / textureHeight,
        sx / textureWidth,
        (sy + sh) / textureHeight,
        (sx + sw) / textureWidth,
        (sy + sh) / textureHeight
      );
    } else {
      this.setTextureCoords(
        sx / textureWidth,
        sy / textureHeight,
        (sx + sw) / textureWidth,
        sy / textureHeight,
        (sx + sw) / textureWidth,
        (sy + sh) / textureHeight,
        sx / textureWidth,
        (sy + sh) / textureHeight
      );
    }
    this.index++;
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
    image: Image,
    color: Color,
    transform: Mat4
  ): void {
    this.drawImageSectionPoints(
      tlX,
      tlY,
      trX,
      trY,
      brX,
      brY,
      blX,
      blY,
      0,
      0,
      image.width,
      image.height,
      image,
      color,
      transform
    );
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
    image: Image,
    color: Color,
    transform: Mat4
  ): void {
    if (this.index >= this.BUFFER_SIZE || this.target || (this.image && this.image !== image)) {
      this.present();
    }

    this.image = image;
    this.p1.transformMat4(transform, tlX, tlY, 0);
    this.p2.transformMat4(transform, trX, trY, 0);
    this.p3.transformMat4(transform, brX, brY, 0);
    this.p4.transformMat4(transform, blX, blY, 0);

    const textureWidth = image.width;
    const textureHeight = image.height;
    this.setVertices(this.p1, this.p2, this.p3, this.p4);
    this.setColor(color);
    this.setTextureCoords(
      sx / textureWidth,
      sy / textureHeight,
      (sx + sw) / textureWidth,
      sy / textureHeight,
      (sx + sw) / textureWidth,
      (sy + sh) / textureHeight,
      sx / textureWidth,
      (sy + sh) / textureHeight
    );
    this.index++;
  }

  drawRenderTarget(x: number, y: number, target: RenderTarget, color: Color, transform: Mat4): void {
    if (this.index >= this.BUFFER_SIZE || this.image || (this.target && this.target !== target)) {
      this.present();
    }
    this.target = target;

    const width = target.width;
    const height = target.height;
    this.p1.transformMat4(transform, x, y, 0);
    this.p2.transformMat4(transform, x + width, y, 0);
    this.p3.transformMat4(transform, x + width, y + height, 0);
    this.p4.transformMat4(transform, x, y + height, 0);

    this.setVertices(this.p1, this.p2, this.p3, this.p4);
    this.setColor(color);
    this.setTextureCoords(0, 1, 1, 1, 1, 0, 0, 0);
    this.index++;
  }

  drawBitmapText(x: number, y: number, font: BitmapFont, text: string, color: Color, transform: Mat4): void {
    if (!text) {
      return;
    }

    if (this.index >= this.BUFFER_SIZE || (this.image && this.image !== font.image)) {
      this.present();
    }
    this.image = font.image;

    let xOffset = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charData = font.getCharData(char);
      if (!charData) {
        continue;
      }

      if (this.index >= this.BUFFER_SIZE) {
        this.present();
      }

      let kerning = 0;
      if (i > 0) {
        const prevChar = text[i - 1];
        kerning = font.getKerning(prevChar, char);
      }
      xOffset += kerning;

      // Apply the transformation matrix to the vertex positions.
      this.p1.transformMat4(transform, x + xOffset + charData.xOffset, y + charData.yOffset, 0);
      this.p2.transformMat4(transform, x + xOffset + charData.xOffset + charData.width, y + charData.yOffset, 0);
      this.p3.transformMat4(
        transform,
        x + xOffset + charData.xOffset + charData.width,
        y + charData.yOffset + charData.height,
        0
      );
      this.p4.transformMat4(transform, x + xOffset + charData.xOffset, y + charData.yOffset + charData.height, 0);

      this.setVertices(this.p1, this.p2, this.p3, this.p4);
      this.setColor(color);
      this.setTextureCoords(
        charData.x / font.image.width,
        charData.y / font.image.height,
        (charData.x + charData.width) / font.image.width,
        charData.y / font.image.height,
        (charData.x + charData.width) / font.image.width,
        (charData.y + charData.height) / font.image.height,
        charData.x / font.image.width,
        (charData.y + charData.height) / font.image.height
      );
      xOffset += charData.xAdvance;
      this.index++;
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
    const gl = this.context.gl;
    gl.activeTexture(gl.TEXTURE0 + textUnit);

    const tex2d = gl.TEXTURE_2D;
    gl.texParameteri(tex2d, gl.TEXTURE_WRAP_S, this.context.getGLTextureWrap(uWrap));
    gl.texParameteri(tex2d, gl.TEXTURE_WRAP_T, this.context.getGLTextureWrap(vWrap));
    gl.texParameteri(tex2d, gl.TEXTURE_MIN_FILTER, this.context.getGLTextureFilter(minFilter, mipmapFilter));
    gl.texParameteri(tex2d, gl.TEXTURE_MAG_FILTER, this.context.getGLTextureFilter(magFilter, mipmapFilter));

    if (minFilter === 'anisotropic' && this.anisotropicFilter) {
      gl.texParameteri(tex2d, this.anisotropicFilter.TEXTURE_MAX_ANISOTROPY_EXT, 4);
    }
  }

  private setVertices(topLeft: Vec3, topRight: Vec3, bottomRight: Vec3, bottomLeft: Vec3): void {
    const i = this.index * OFFSET;
    this.vertexIndices[i] = topLeft.x;
    this.vertexIndices[i + 1] = topLeft.y;
    this.vertexIndices[i + 2] = 0;
    this.vertexIndices[i + 9] = topRight.x;
    this.vertexIndices[i + 10] = topRight.y;
    this.vertexIndices[i + 11] = 0;
    this.vertexIndices[i + 18] = bottomRight.x;
    this.vertexIndices[i + 19] = bottomRight.y;
    this.vertexIndices[i + 20] = 0;
    this.vertexIndices[i + 27] = bottomLeft.x;
    this.vertexIndices[i + 28] = bottomLeft.y;
    this.vertexIndices[i + 29] = 0;
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
    this.vertexIndices[i + 12] = red;
    this.vertexIndices[i + 13] = green;
    this.vertexIndices[i + 14] = blue;
    this.vertexIndices[i + 15] = alpha;
    this.vertexIndices[i + 21] = red;
    this.vertexIndices[i + 22] = green;
    this.vertexIndices[i + 23] = blue;
    this.vertexIndices[i + 24] = alpha;
    this.vertexIndices[i + 30] = red;
    this.vertexIndices[i + 31] = green;
    this.vertexIndices[i + 32] = blue;
    this.vertexIndices[i + 33] = alpha;
  }

  private setTextureCoords(
    tlX: number,
    tlY: number,
    trX: number,
    trY: number,
    brX: number,
    brY: number,
    blX: number,
    blY: number
  ): void {
    const i = this.index * OFFSET;
    this.vertexIndices[i + 7] = tlX;
    this.vertexIndices[i + 8] = tlY;
    this.vertexIndices[i + 16] = trX;
    this.vertexIndices[i + 17] = trY;
    this.vertexIndices[i + 25] = brX;
    this.vertexIndices[i + 26] = brY;
    this.vertexIndices[i + 34] = blX;
    this.vertexIndices[i + 35] = blY;
  }

  private createDefaultPipeline(): void {
    const vertexSource = imageVert(this.context.isGL1);
    const vertexShader = new Shader(vertexSource, 'vertex');

    const fragmentSource = imageFrag(this.context.isGL1);
    const fragmentShader = new Shader(fragmentSource, 'fragment');

    this.defaultPipeline = new Pipeline(vertexShader, fragmentShader, true);
    this.pipeline = this.defaultPipeline;
  }
}
