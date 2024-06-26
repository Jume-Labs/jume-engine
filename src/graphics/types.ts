export type BlendMode =
  | 'undefined'
  | 'blend one'
  | 'blend zero'
  | 'source alpha'
  | 'destination alpha'
  | 'inverse source alpha'
  | 'inverse destination alpha'
  | 'source color'
  | 'destination color'
  | 'inverse source color'
  | 'inverse destination color';

export type BlendOperation = 'add' | 'subtract' | 'reverse subtract';

export type MipmapFilter = 'none' | 'nearest' | 'linear';

export type TextureFilter = 'nearest' | 'linear' | 'anisotropic';

export type TextureWrap = 'repeat' | 'clamp to edge' | 'mirrored repeat';

export type ShaderType = 'vertex' | 'fragment';

export type LineAlign = 'inside' | 'center' | 'outside';
