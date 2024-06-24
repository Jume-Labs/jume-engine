type Mat4Value = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export class Mat4 {
  value: Mat4Value;

  static readonly POOL: Mat4[] = [];

  static get(data?: Mat4Value): Mat4 {
    if (Mat4.POOL.length > 0) {
      const mat = Mat4.POOL.pop()!;
      if (data) {
        mat.value[0] = data[0];
        mat.value[1] = data[1];
        mat.value[2] = data[2];
        mat.value[3] = data[3];
        mat.value[4] = data[4];
        mat.value[5] = data[5];
        mat.value[6] = data[6];
        mat.value[7] = data[7];
        mat.value[8] = data[8];
        mat.value[9] = data[9];
        mat.value[10] = data[10];
        mat.value[11] = data[11];
        mat.value[12] = data[12];
        mat.value[13] = data[13];
        mat.value[14] = data[14];
        mat.value[15] = data[15];
      } else {
        mat.identity();
      }

      return mat;
    }

    return new Mat4(data);
  }

  static fromTranslation(x: number, y: number, z: number, out?: Mat4): Mat4 {
    if (!out) {
      out = Mat4.get();
    }

    out.value[0] = 1;
    out.value[1] = 0;
    out.value[2] = 0;
    out.value[3] = 0;
    out.value[4] = 0;
    out.value[5] = 1;
    out.value[6] = 0;
    out.value[7] = 0;
    out.value[8] = 0;
    out.value[9] = 0;
    out.value[10] = 1;
    out.value[11] = 0;
    out.value[12] = x;
    out.value[13] = y;
    out.value[14] = z;
    out.value[15] = 1;

    return out;
  }

  static fromZRotation(rotation: number, out?: Mat4): Mat4 {
    if (!out) {
      out = Mat4.get();
    }

    const sin = Math.sin(rotation);
    const cos = Math.cos(rotation);

    out.value[0] = cos;
    out.value[1] = sin;
    out.value[2] = 0;
    out.value[3] = 0;
    out.value[4] = -sin;
    out.value[5] = cos;
    out.value[6] = 0;
    out.value[7] = 0;
    out.value[8] = 0;
    out.value[9] = 0;
    out.value[10] = 1;
    out.value[11] = 0;
    out.value[12] = 0;
    out.value[13] = 0;
    out.value[14] = 0;
    out.value[15] = 1;

    return out;
  }

  static fromScale(x: number, y: number, z: number, out?: Mat4): Mat4 {
    if (!out) {
      out = Mat4.get();
    }

    out.value[0] = x;
    out.value[1] = 0;
    out.value[2] = 0;
    out.value[3] = 0;
    out.value[4] = 0;
    out.value[5] = y;
    out.value[6] = 0;
    out.value[7] = 0;
    out.value[8] = 0;
    out.value[9] = 0;
    out.value[10] = z;
    out.value[11] = 0;
    out.value[12] = 0;
    out.value[13] = 0;
    out.value[14] = 0;
    out.value[15] = 1;

    return out;
  }

  static from2dRotationTranslationScale(
    rotation: number,
    x: number,
    y: number,
    scaleX: number,
    scaleY: number,
    out?: Mat4
  ): Mat4 {
    if (!out) {
      out = Mat4.get();
    }

    const z = Math.sin(rotation * 0.5);
    const w = Math.cos(rotation * 0.5);

    const z2 = z + z;
    const zz = z * z2;
    const wz = w * z2;

    out.value[0] = (1 - zz) * scaleX;
    out.value[1] = wz * scaleX;
    out.value[2] = 0;
    out.value[3] = 0;
    out.value[4] = (0 - wz) * scaleY;
    out.value[5] = (1 - zz) * scaleY;
    out.value[6] = 0;
    out.value[7] = 0;
    out.value[8] = 0;
    out.value[9] = 0;
    out.value[10] = 1;
    out.value[11] = 0;
    out.value[12] = x;
    out.value[13] = y;
    out.value[14] = 0;
    out.value[15] = 1;

    return out;
  }

  constructor(data?: Mat4Value) {
    if (data) {
      this.value = [
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
        data[6],
        data[7],
        data[8],
        data[9],
        data[10],
        data[11],
        data[12],
        data[13],
        data[14],
        data[15],
      ];
    } else {
      this.value = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
  }

  identity() {
    this.value[0] = 1;
    this.value[1] = 0;
    this.value[2] = 0;
    this.value[3] = 0;
    this.value[4] = 0;
    this.value[5] = 1;
    this.value[6] = 0;
    this.value[7] = 0;
    this.value[8] = 0;
    this.value[9] = 0;
    this.value[10] = 1;
    this.value[11] = 0;
    this.value[12] = 0;
    this.value[13] = 0;
    this.value[14] = 0;
    this.value[15] = 1;
  }

  equals({ value }: Mat4): boolean {
    return (
      this.value[0] === value[0] &&
      this.value[1] === value[1] &&
      this.value[2] === value[2] &&
      this.value[3] === value[3] &&
      this.value[4] === value[4] &&
      this.value[5] === value[5] &&
      this.value[6] === value[6] &&
      this.value[7] === value[7] &&
      this.value[8] === value[8] &&
      this.value[9] === value[9] &&
      this.value[10] === value[10] &&
      this.value[11] === value[11] &&
      this.value[12] === value[12] &&
      this.value[13] === value[13] &&
      this.value[14] === value[14] &&
      this.value[15] === value[15]
    );
  }

  copyFrom({ value }: Mat4) {
    this.value[0] = value[0];
    this.value[1] = value[1];
    this.value[2] = value[2];
    this.value[3] = value[3];
    this.value[4] = value[4];
    this.value[5] = value[5];
    this.value[6] = value[6];
    this.value[7] = value[7];
    this.value[8] = value[8];
    this.value[9] = value[9];
    this.value[10] = value[10];
    this.value[11] = value[11];
    this.value[12] = value[12];
    this.value[13] = value[13];
    this.value[14] = value[14];
    this.value[15] = value[15];
  }

  ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);

    this.value[0] = -2 * lr;
    this.value[1] = 0;
    this.value[2] = 0;
    this.value[3] = 0;
    this.value[4] = 0;
    this.value[5] = -2 * bt;
    this.value[6] = 0;
    this.value[7] = 0;
    this.value[8] = 0;
    this.value[9] = 0;
    this.value[10] = 2 * nf;
    this.value[11] = 0;
    this.value[12] = (left + right) * lr;
    this.value[13] = (top + bottom) * bt;
    this.value[14] = (far + near) * nf;
    this.value[15] = 1;
  }

  invert(out: Mat4) {
    const a00 = this.value[0];
    const a01 = this.value[1];
    const a02 = this.value[2];
    const a03 = this.value[3];
    const a10 = this.value[4];
    const a11 = this.value[5];
    const a12 = this.value[6];
    const a13 = this.value[7];
    const a20 = this.value[8];
    const a21 = this.value[9];
    const a22 = this.value[10];
    const a23 = this.value[11];
    const a30 = this.value[12];
    const a31 = this.value[13];
    const a32 = this.value[14];
    const a33 = this.value[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det == 0) {
      return null;
    }
    det = 1.0 / det;

    out.value[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out.value[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out.value[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out.value[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out.value[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out.value[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out.value[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out.value[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out.value[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out.value[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out.value[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out.value[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out.value[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out.value[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out.value[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out.value[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
  }

  put() {
    Mat4.POOL.push(this);
  }

  toFloat32Array(): Float32Array {
    return new Float32Array(this.value);
  }

  toString(): string {
    return `[ ${this.value[0]}, ${this.value[1]}, ${this.value[2]}, ${this.value[3]}, ${this.value[4]}' +
      ', ${this.value[5]}, ${this.value[6]}, ${this.value[7]}, ${this.value[8]}, ${this.value[9]}' +
      ', ${this.value[10]}, ${this.value[11]}, ${this.value[12]}, ${this.value[13]}, ${this.value[14]}' +
      ', ${this.value[15]} ]`;
  }
}
