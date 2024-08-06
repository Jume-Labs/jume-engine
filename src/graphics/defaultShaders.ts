const SHAPE_VERT = [
  '#version 300 es',
  'in vec3 vertexPosition;',
  'in vec4 vertexColor;',
  'uniform mat4 projectionMatrix;',
  'out vec4 fragmentColor;',
  'void main() {',
  ' gl_Position = projectionMatrix * vec4(vertexPosition, 1.0);',
  ' fragmentColor = vertexColor;',
  '}',
].join('\n');

const SHAPE_FRAG = [
  '#version 300 es',
  'precision mediump float;',
  'in vec4 fragmentColor;',
  'out vec4 FragColor;',
  'void main() {',
  ' FragColor = fragmentColor;',
  '}',
].join('\n');

const SHAPE_VERT_GL1 = [
  '#version 100',
  'attribute vec3 vertexPosition;',
  'attribute vec4 vertexColor;',
  'uniform mat4 projectionMatrix;',
  'varying vec4 fragmentColor;',
  'void main() {',
  ' gl_Position = projectionMatrix * vec4(vertexPosition, 1.0);',
  ' fragmentColor = vertexColor;',
  '}',
].join('\n');

const SHAPE_FRAG_GL1 = [
  '#version 100',
  'precision mediump float;',
  'varying vec4 fragmentColor;',
  'void main() {',
  ' gl_FragColor = fragmentColor;',
  '}',
].join('\n');

const IMAGE_VERT = [
  '#version 300 es',
  'in vec3 vertexPosition;',
  'in vec4 vertexColor;',
  'in vec2 vertexUV;',
  'uniform mat4 projectionMatrix;',
  'out vec2 fragUV;',
  'out vec4 fragColor;',
  'void main() {',
  ' gl_Position = projectionMatrix * vec4(vertexPosition, 1.0);',
  ' fragUV = vertexUV;',
  ' fragColor = vertexColor;',
  '}',
].join('\n');

const IMAGE_FRAG = [
  '#version 300 es',
  'precision mediump float;',
  'uniform sampler2D tex;',
  'in vec2 fragUV;',
  'in vec4 fragColor;',
  'out vec4 FragColor;',
  'void main() {',
  ' vec4 texColor = texture(tex, fragUV) * fragColor;',
  ' texColor.rgb *= fragColor.a;',
  ' FragColor = texColor;',
  '}',
].join('\n');

const IMAGE_VERT_GL1 = [
  '#version 100',
  'attribute vec3 vertexPosition;',
  'attribute vec4 vertexColor;',
  'attribute vec2 vertexUV;',
  'uniform mat4 projectionMatrix;',
  'varying vec2 fragUV;',
  'varying vec4 fragColor;',
  'void main() {',
  ' gl_Position = projectionMatrix * vec4(vertexPosition, 1.0);',
  ' fragUV = vertexUV;',
  ' fragColor = vertexColor;',
  '}',
].join('\n');

const IMAGE_FRAG_GL1 = [
  '#version 100',
  'precision mediump float;',
  'uniform sampler2D tex;',
  'varying vec2 fragUV;',
  'varying vec4 fragColor;',
  'void main() {',
  ' vec4 texColor = texture2D(tex, fragUV) * fragColor;',
  ' texColor.rgb *= fragColor.a;',
  ' gl_FragColor = texColor;',
  '}',
].join('\n');

export function shapeVert(gl1: boolean): string {
  return gl1 ? SHAPE_VERT_GL1 : SHAPE_VERT;
}

export function shapeFrag(gl1: boolean): string {
  return gl1 ? SHAPE_FRAG_GL1 : SHAPE_FRAG;
}

export function imageVert(gl1: boolean): string {
  return gl1 ? IMAGE_VERT_GL1 : IMAGE_VERT;
}

export function imageFrag(gl1: boolean): string {
  return gl1 ? IMAGE_FRAG_GL1 : IMAGE_FRAG;
}
