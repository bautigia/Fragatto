import perfumes from "@/data/perfumes.json";

// Ignora formatos agotados (stock === 0) o sin precio todavía (precio null,
// "Próximamente") al calcular el precio "desde". Si no queda ninguno
// disponible devuelve null: la UI muestra "Agotado" en su lugar.
export function precioDesde(producto) {
  const disponibles = producto.formatos.filter((f) => f.stock !== 0 && f.precio != null);
  if (disponibles.length === 0) return null;
  return Math.min(...disponibles.map((f) => f.precio));
}

export function formatPrecio(precio) {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export function getFilterOptions() {
  const marcas = new Set();
  const familias = new Set();
  const generos = new Set();
  const tipos = new Set();

  for (const p of perfumes) {
    marcas.add(p.marca);
    familias.add(p.familia);
    generos.add(p.genero);
    for (const f of p.formatos) tipos.add(f.tipo);
  }

  return {
    marcas: ["todas", ...Array.from(marcas).sort()],
    familias: ["todas", ...Array.from(familias).sort()],
    generos: ["todos", ...Array.from(generos).sort()],
    tipos: ["todos", ...Array.from(tipos).sort()],
  };
}
