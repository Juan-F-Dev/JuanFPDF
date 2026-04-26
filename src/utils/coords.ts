// ? Factor de conversión: 96 DPI / 25.4 mm/pulgada
export const MM_TO_PX_FACTOR = 3.779527559;

// ? Convierte píxeles de pantalla a milímetros FPDF.
export const pxToMm = (px: number): number => {
  return parseFloat((px / MM_TO_PX_FACTOR).toFixed(2)); // Redondeamos a 2 decimales para limpieza
};

// ? Convierte milímetros FPDF a píxeles de pantalla (para el style visual).
export const mmToPx = (mm: number): number => {
  return Math.round(mm * MM_TO_PX_FACTOR);
};
