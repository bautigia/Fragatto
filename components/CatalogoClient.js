"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import RevealOnScroll from "./RevealOnScroll";

function coincideFiltro(producto, filtro) {
  const tipos = new Set(producto.formatos.map((f) => f.tipo));
  const tieneDecant = tipos.has("decant");
  const tieneFrasco = tipos.has("frasco completo");
  if (filtro === "decant") return tieneDecant && !tieneFrasco;
  if (filtro === "ambos") return tieneDecant && tieneFrasco;
  if (filtro === "frasco") return tieneFrasco;
  return true;
}

export default function CatalogoClient({ productos }) {
  const [filtro, setFiltro] = useState(null);

  const productosFiltrados = useMemo(() => {
    if (!filtro) return productos;
    return productos.filter((p) => coincideFiltro(p, filtro));
  }, [productos, filtro]);

  // Mientras ningún frasco completo tenga precio cargado todavía, lo
  // aclaramos en el propio botón del filtro para que no parezca que ya se
  // puede comprar. En cuanto se cargue el primer precio real, desaparece solo.
  const hayFrascoConPrecio = productos.some((p) =>
    p.formatos.some((f) => f.tipo === "frasco completo" && f.precio != null)
  );
  const sufijoFrasco = hayFrascoConPrecio ? "" : " · Próximamente";

  const filtros = [
    { id: "decant", label: "Decant" },
    { id: "ambos", label: `Decant y frasco${sufijoFrasco}` },
    { id: "frasco", label: `Frasco completo${sufijoFrasco}` },
  ];

  function toggleFiltro(id) {
    setFiltro((actual) => (actual === id ? null : id));
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.id}
            onClick={() => toggleFiltro(f.id)}
            aria-pressed={filtro === f.id}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracked-caps ${
              filtro === f.id
                ? "border-accent bg-accent text-paper"
                : "border-line text-ink-soft hover:border-accent hover:text-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="text-ink-soft">Por ahora no hay perfumes con este formato.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {productosFiltrados.map((producto, i) => (
            <RevealOnScroll key={producto.id} delay={(i % 3) * 90}>
              <ProductCard producto={producto} />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </>
  );
}
