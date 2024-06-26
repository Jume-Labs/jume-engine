export type ScaleModeReturn = {
  viewWidth: number;
  viewHeight: number;
  scaleFactorX: number;
  scaleFactorY: number;
  offsetX: number;
  offsetY: number;
};

export type ScaleMode = (
  designWidth: number,
  designHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  anchorX: number,
  anchorY: number
) => ScaleModeReturn;

/**
 * Scale the view to fit the canvas. Will cut off parts of the view to make it fit. Keeps aspect ratio.
 * @param designWidth The width the game is designed for in pixels.
 * @param designHeight The height the game is designed for in pixels.
 * @param canvasWidth The width of the canvas in pixels.
 * @param canvasHeight The height of the canvas in pixels.
 * @param anchorX The horizontal view anchor (0 - 1).
 * @param anchorY The vertical view anchor (0 - 1).
 * @return The scaled values.
 */
export function scaleModeFitView(
  designWidth: number,
  designHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  anchorX: number,
  anchorY: number
): ScaleModeReturn {
  const designRatio = designWidth / designHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let viewWidth = 0;
  let viewHeight = 0;
  if (canvasRatio < designRatio) {
    viewWidth = designWidth;
    viewHeight = Math.ceil(viewWidth / canvasRatio);
  } else {
    viewHeight = designHeight;
    viewWidth = Math.ceil(viewHeight * canvasRatio);
  }

  const scaleFactor = canvasWidth / viewWidth;

  const offsetX = (canvasWidth - designWidth * scaleFactor) * anchorX;
  const offsetY = (canvasHeight - designHeight * scaleFactor) * anchorY;

  return {
    viewWidth,
    viewHeight,
    scaleFactorX: scaleFactor,
    scaleFactorY: scaleFactor,
    offsetX,
    offsetY,
  };
}

/**
 * Scale the view to fit the width of the canvas. Will cut off parts at the top and bottom to fit. Keeps aspect ratio.
 * @param designWidth The width the game is designed for in pixels.
 * @param designHeight The height the game is designed for in pixels.
 * @param canvasWidth The width of the canvas in pixels.
 * @param canvasHeight The height of the canvas in pixels.
 * @param anchorX The horizontal view anchor (0 - 1).
 * @param anchorY The vertical view anchor (0 - 1).
 * @return The scaled values.
 */
export function scaleModeFitWidth(
  designWidth: number,
  designHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  anchorX: number,
  anchorY: number
): ScaleModeReturn {
  const canvasRatio = canvasWidth / canvasHeight;
  const viewWidth = designWidth;
  const viewHeight = Math.ceil(viewWidth / canvasRatio);

  const scaleFactor = canvasWidth / viewWidth;

  const offsetX = (canvasWidth - designWidth * scaleFactor) * anchorX;
  const offsetY = (canvasHeight - designHeight * scaleFactor) * anchorY;

  return {
    viewWidth,
    viewHeight,
    scaleFactorX: scaleFactor,
    scaleFactorY: scaleFactor,
    offsetX,
    offsetY,
  };
}

/**
 * Scale the view to fit the height of the canvas. Will cut off parts at the left and right to fit. Keeps aspect ratio.
 * @param designWidth The width the game is designed for in pixels.
 * @param designHeight The height the game is designed for in pixels.
 * @param canvasWidth The width of the canvas in pixels.
 * @param canvasHeight The height of the canvas in pixels.
 * @param anchorX The horizontal view anchor (0 - 1).
 * @param anchorY The vertical view anchor (0 - 1).
 * @return The scaled values.
 */
export function scaleModeFitHeight(
  designWidth: number,
  designHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  anchorX: number,
  anchorY: number
): ScaleModeReturn {
  const canvasRatio = canvasWidth / canvasHeight;
  const viewHeight = designHeight;
  const viewWidth = Math.ceil(viewHeight * canvasRatio);

  const scaleFactor = canvasHeight / viewHeight;

  const offsetX = (canvasWidth - designWidth * scaleFactor) * anchorX;
  const offsetY = (canvasHeight - designHeight * scaleFactor) * anchorY;

  return {
    viewWidth,
    viewHeight,
    scaleFactorX: scaleFactor,
    scaleFactorY: scaleFactor,
    offsetX,
    offsetY,
  };
}

/**
 * Don't scale the view. Just offset it inside the canvas if needed.
 * @param designWidth The width the game is designed for in pixels.
 * @param designHeight The height the game is designed for in pixels.
 * @param canvasWidth The width of the canvas in pixels.
 * @param canvasHeight The height of the canvas in pixels.
 * @param anchorX The horizontal view anchor (0 - 1).
 * @param anchorY The vertical view anchor (0 - 1).
 * @return The scaled values.
 */
export function scaleModeNoScale(
  designWidth: number,
  designHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  anchorX: number,
  anchorY: number
): ScaleModeReturn {
  const offsetX = (canvasWidth - designWidth) * anchorX;
  const offsetY = (canvasHeight - designHeight) * anchorY;

  return {
    viewWidth: designWidth,
    viewHeight: designHeight,
    scaleFactorX: 1.0,
    scaleFactorY: 1.0,
    offsetX,
    offsetY,
  };
}

/**
 * Stretch the view to fit the canvas. Does not keep the aspect ratio and can distort the view.
 * @param designWidth The width the game is designed for in pixels.
 * @param designHeight The height the game is designed for in pixels.
 * @param canvasWidth The width of the canvas in pixels.
 * @param canvasHeight The height of the canvas in pixels.
 * @param anchorX The horizontal view anchor (0 - 1).
 * @param anchorY The vertical view anchor (0 - 1).
 * @return The scaled values.
 */
export function scaleModeStretch(
  designWidth: number,
  designHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  _anchorX: number,
  _anchorY: number
): ScaleModeReturn {
  const viewWidth = designWidth;
  const viewHeight = designHeight;

  const scaleFactorX = canvasWidth / viewWidth;
  const scaleFactorY = canvasHeight / viewHeight;

  return {
    viewWidth,
    viewHeight,
    scaleFactorX,
    scaleFactorY,
    offsetX: 0,
    offsetY: 0,
  };
}
