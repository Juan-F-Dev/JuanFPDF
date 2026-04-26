export interface Point {
  x: number;
  y: number;
}

export interface CanvasState {
  // * Estado base
  scale: number;
  pan: Point;

  // * Límites de configuración (para no perder el canvas)
  minScale: number;
  maxScale: number;

  // * Tamaño del área de trabajo (para calcular los límites de paneo después)
  canvasWidth: number;
  canvasHeight: number;

  // * Tamaño del viwport
  viewportWidth: number;
  viewportHeight: number;
}

export interface CanvasActions {
  setPan: (pan: Point | ((prev: Point) => Point)) => void;
  setScale: (scale: number | ((prev: number) => number)) => void;
  handleWheelZoom: (deltaY: number, mouseX: number, mouseY: number) => void;
  setViewportSize: (width: number, height: number) => void;
  centerCanvas: () => void;
  zoomToFit: () => void;
}
