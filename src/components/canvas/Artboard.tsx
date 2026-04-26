import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const Artboard = () => {
  const scale = useCanvasStore((state) => state.scale);
  const pan = useCanvasStore((state) => state.pan);
  const canvasWidth = useCanvasStore((state) => state.canvasWidth);
  const canvasHeight = useCanvasStore((state) => state.canvasHeight);

  const setPan = useCanvasStore((state) => state.setPan);
  const handleWheelZoom = useCanvasStore((state) => state.handleWheelZoom);

  const setViewportSize = useCanvasStore((state) => state.setViewportSize);

  const zoomToFit = useCanvasStore((state) => state.zoomToFit);

  const viewportRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Le avisamos a Zustand del nuevo tamaño de la ventana
        setViewportSize(entry.contentRect.width, entry.contentRect.height);

        // Si es la primera vez que carga, centramos el lienzo
        if (!isInitialized.current && entry.contentRect.width > 0) {
          zoomToFit();
          isInitialized.current = true;
        }
      }
    });

    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
    };
  }, [setViewportSize, zoomToFit]);

  // 2. Estado local estrictamente para la UI (Interacción temporal)
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Manejo de la tecla Espacio (sin cambios bruscos)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpaceDown) {
        e.preventDefault();
        setIsSpaceDown(true);
      }

      if (e.shiftKey && e.code === 'Digit1') {
        e.preventDefault();
        zoomToFit();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpaceDown(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpaceDown, zoomToFit]);

  // El listener del Wheel ahora está optimizado (Sin dependencias reactivas)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey) {
        // Obtenemos la posición exacta del ratón relativa al viewport
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Delegamos la matemática pesada a Zustand
        handleWheelZoom(e.deltaY, mouseX, mouseY);
      } else {
        // Paneo libre con el trackpad o rueda normal
        setPan((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY
        }));
      }
    };

    // Al no tener dependencias en el arreglo [], este listener se registra solo una vez.
    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, [handleWheelZoom, setPan]);

  // 5. Lógica de Paneo con el ratón
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSpaceDown || e.button === 1) {
      e.preventDefault();
      setIsDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    setPan((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  let cursorClass = 'cursor-default';
  if (isSpaceDown) {
    cursorClass = isDragging ? 'cursor-grabbing' : 'cursor-grab';
  }

  return (
    <div
      ref={viewportRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`w-full h-full overflow-hidden bg-gray-100 relative ${cursorClass}`}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          willChange: 'transform'
        }}
      >
        <div
          className="bg-white artboard-shadow"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            cursor: !isSpaceDown ? 'crosshair' : 'inherit'
          }}
        >
          {/* El contenido de la hoja va aquí */}
        </div>
      </div>
    </div>
  );
};
