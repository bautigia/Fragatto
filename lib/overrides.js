import { createClient } from "@/lib/supabase/server";

// Sentinel de precio que marca un formato como "sacado" desde /admin (ver
// quitarFrascoCompleto en app/admin/actions.js). No es un precio real: ningún
// producto puede costar negativo, así que sirve para distinguir "este
// producto nunca tuvo frasco completo" de "el admin lo sacó a propósito" sin
// necesitar una columna nueva en Supabase.
export const FRASCO_REMOVIDO_SENTINEL = -1;

function claveFormato(productoId, ml, tipo) {
  return `${productoId}|${ml}|${tipo}`;
}

// Devuelve un Map vacío si Supabase no está configurado o la consulta falla,
// para que el catálogo siga funcionando con los precios del JSON como fallback.
export async function getFormatoOverrides() {
  const overrides = new Map();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return overrides;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("formato_precio_stock")
      .select("producto_id, ml, tipo, precio, stock");
    if (error || !data) return overrides;

    for (const fila of data) {
      overrides.set(claveFormato(fila.producto_id, fila.ml, fila.tipo), {
        precio: fila.precio,
        stock: fila.stock,
      });
    }
  } catch {
    return overrides;
  }

  return overrides;
}

export function claveFormatoOverride(productoId, ml, tipo) {
  return claveFormato(productoId, ml, tipo);
}
