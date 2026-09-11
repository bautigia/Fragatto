export default function VisitStats({ visitas, productos }) {
  const nombrePorId = new Map(productos.map((p) => [p.id, p.nombre]));

  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-black/50">Visitas</p>
        <div className="mt-3 flex gap-6">
          <div>
            <p className="text-2xl font-semibold">{visitas.semana}</p>
            <p className="text-xs text-black/50">últimos 7 días</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{visitas.mes}</p>
            <p className="text-xs text-black/50">este mes</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-black/50">
          Perfumes más vistos este mes
        </p>
        {visitas.masVistos.length === 0 ? (
          <p className="mt-3 text-sm text-black/50">Todavía no hay datos suficientes.</p>
        ) : (
          <ol className="mt-3 flex flex-col gap-1.5">
            {visitas.masVistos.map(([productoId, vistas], i) => (
              <li key={productoId} className="flex items-center justify-between text-sm">
                <span>
                  {i + 1}. {nombrePorId.get(productoId) ?? productoId}
                </span>
                <span className="text-black/50">{vistas}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
