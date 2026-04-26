import { create } from 'zustand';
import type { CanvasState, CanvasActions } from '../interfaces';

type CanvasStore = CanvasState & CanvasActions;

const initialState = {
  scale: 1,
  pan: { x: 0, y: 0 },
  minScale: 0.1,
  maxScale: 5,
  canvasWidth: 794,
  canvasHeight: 1122,
  viewportWidth: 0,
  viewportHeight: 0
};

export const useCanvasStore = create<CanvasStore>()((set) => ({
  ...initialState,
  // Setter básico para el controlar el tamaño del vieport
  setViewportSize: (width, height) =>
    set({ viewportWidth: width, viewportHeight: height }),

  // Setter básico para el paneo (soporta callback o valor directo)
  setPan: (panOrUpdater) =>
    set((state) => {
      const nextPan =
        typeof panOrUpdater === 'function'
          ? panOrUpdater(state.pan)
          : panOrUpdater;

      // Calculamos el tamaño real del canvas con el zoom actual
      const scaledWidth = state.canvasWidth * state.scale;
      const scaledHeight = state.canvasHeight * state.scale;

      // Margen de seguridad: ¿Cuántos píxeles mínimos deben quedar visibles en pantalla?
      const SAFE_MARGIN = 150;

      // Calculamos los límites máximos y mínimos a los que puede llegar x e y
      const minX = -scaledWidth + SAFE_MARGIN;
      const maxX = state.viewportWidth - SAFE_MARGIN;
      const minY = -scaledHeight + SAFE_MARGIN;
      const maxY = state.viewportHeight - SAFE_MARGIN;

      return {
        pan: {
          x: Math.min(Math.max(nextPan.x, minX), maxX),
          y: Math.min(Math.max(nextPan.y, minY), maxY)
        }
      };
    }),

  // Setter básico para la escala
  setScale: (scaleOrUpdater) =>
    set((state) => {
      const newScale =
        typeof scaleOrUpdater === 'function'
          ? scaleOrUpdater(state.scale)
          : scaleOrUpdater;
      // Siempre respetamos los límites, incluso si se setea manualmente
      return {
        scale: Math.min(Math.max(state.minScale, newScale), state.maxScale)
      };
    }),

  // La joya de la corona: Zoom hacia el cursor suavizado
  handleWheelZoom: (deltaY, mouseX, mouseY) => {
    set((state) => {
      // a) Normalización (Step Smoothing)
      // Math.sign convierte cualquier valor de deltaY a 1, -1 o 0.
      // Esto ignora si el usuario usa un ratón ruidoso o un trackpad ultrasensible,
      // el salto de zoom siempre será constante (ej. 10% por "tick").
      const zoomStep = 0.1;
      const direction = Math.sign(deltaY);

      let newScale = state.scale - direction * zoomStep * state.scale;
      newScale = Math.min(Math.max(state.minScale, newScale), state.maxScale);

      // Si topamos con el límite máximo o mínimo, abortamos para ahorrar cálculos
      if (newScale === state.scale) return state;

      // b) Matemática de coordenadas transformadas
      // Calculamos la proporción de cambio entre la escala nueva y la vieja.
      const scaleRatio = newScale / state.scale;

      // Ajustamos el "pan" para que el punto debajo del cursor se mantenga exactamente
      // en el mismo pixel físico de la pantalla tras el cambio de escala.
      const newX = mouseX - (mouseX - state.pan.x) * scaleRatio;
      const newY = mouseY - (mouseY - state.pan.y) * scaleRatio;

      return {
        scale: newScale,
        pan: { x: newX, y: newY }
      };
    });
  },

  // Centrar el canva
  centerCanvas: () =>
    set((state) => {
      const scaledWidth = state.canvasWidth * state.scale;
      const scaledHeight = state.canvasHeight * state.scale;

      return {
        pan: {
          x: (state.viewportWidth - scaledWidth) / 2,
          y: (state.viewportHeight - scaledHeight) / 2
        }
      };
    }),

  zoomToFit: () =>
    set((state) => {
      // Si el viewport aún no tiene tamaño, abortamos para evitar errores
      if (state.viewportWidth === 0 || state.viewportHeight === 0) return state;

      // Margen visual en píxeles para que la hoja "respire" y no toque los bordes
      const padding = 40;
      const availableWidth = state.viewportWidth - padding * 2;
      const availableHeight = state.viewportHeight - padding * 2;

      // Calculamos qué escala necesitaríamos para el ancho y para el alto
      const scaleX = availableWidth / state.canvasWidth;
      const scaleY = availableHeight / state.canvasHeight;

      // Tomamos la escala MENOR. Así garantizamos que el lado más grande quepa completo.
      let newScale = Math.min(scaleX, scaleY);

      // Nos aseguramos de no romper los límites generales
      newScale = Math.min(Math.max(state.minScale, newScale), state.maxScale);

      return {
        scale: newScale,
        pan: {
          x: (state.viewportWidth - state.canvasWidth * newScale) / 2,
          y: (state.viewportHeight - state.canvasHeight * newScale) / 2
        }
      };
    })
}));
