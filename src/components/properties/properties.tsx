export const Properties = () => {
  return (
    <aside className="flex flex-col gap-y-5 w-70 p-4 shrink-0 bg-(--bg-sidebar) border-l h-full shadow-xl z-10 text-slate-200">
      <h2 className="text-lg font-bold text-slate-300 ">Propiedades</h2>
      <div className="">
        <p className="text-sm text-slate-300">
          Selecciona un elemento para editar
        </p>
      </div>
      <button className="py-2 mt-auto text-sm font-bold bg-[#0c8ce9] rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm">
        Generar
      </button>
    </aside>
  );
};
