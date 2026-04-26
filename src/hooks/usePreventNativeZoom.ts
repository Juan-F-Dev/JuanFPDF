import { useEffect } from 'react';
// import { useCanvasStore } from './useCanvasStore'; // Para usarlo luego

export const usePreventNativeZoom = () => {
  useEffect(() => {
    // 1. Bloqueamos Ctrl + Rueda en CUALQUIER parte de la pantalla (ej. sobre los sidebars)
    const handleGlobalWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Detiene el zoom de la interfaz del navegador
      }
    };

    // 2. Bloqueamos los atajos de teclado nativos (Ctrl + '+', Ctrl + '-', Ctrl + '0')
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.ctrlKey &&
        (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')
      ) {
        e.preventDefault(); // Detiene el zoom de la interfaz del navegador

        // Aquí es donde, más adelante, conectaremos las acciones de Zustand
        // para que estos atajos hagan zoom AL CANVAS en lugar de a la UI.
      }
    };

    // OBLIGATORIO: { passive: false } permite que preventDefault() funcione
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    window.addEventListener('keydown', handleGlobalKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);
};
