import { Artboard } from '../canvas/Artboard';
import { Properties } from '../properties/properties';

export function Main() {
  return (
    <>
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar Izquierdo: Fondo oscuro, bordes sutiles y texto claro */}
        <aside className="w-70 p-4 shrink-0 bg-(--bg-sidebar) border-r border-slate-800 shadow-xl z-10">
          <h2 className="text-lg font-bold text-slate-300 "> Elementos</h2>
          <div className="space-y-2 py-10"></div>
        </aside>

        {/* Centro: Área de trabajo (sin cambios) */}
        <section className="flex-1 overflow-auto  flex justify-center">
          <Artboard />
        </section>

        {/* Sidebar Derecho */}
        <Properties />
      </main>
    </>
  );
}
