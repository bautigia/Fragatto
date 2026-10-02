import perfumes from "@/data/perfumes.json";
import { getFormatoOverrides, claveFormatoOverride, FRASCO_REMOVIDO_SENTINEL } from "@/lib/overrides";

function conFormatosMezclados(producto, overrides) {
  const delJson = producto.formatos.map((f) => {
    const override = overrides.get(claveFormatoOverride(producto.id, f.ml, f.tipo));
    return {
      ...f,
      precio: override?.precio ?? f.precio,
      stock: override?.stock ?? null,
    };
  });

  // Un "frasco completo" agregado desde /admin para un producto que en el
  // JSON solo tiene decant no tiene entrada propia en `producto.formatos`:
  // lo sumamos acá si hay un override de Supabase para ese producto que no
  // matchea ninguno de los formatos ya listados.
  for (const [clave, override] of overrides) {
    const [productoId, mlStr, tipo] = clave.split("|");
    if (productoId !== producto.id) continue;
    const ml = Number(mlStr);
    const yaListado = delJson.some((f) => f.ml === ml && f.tipo === tipo);
    if (!yaListado && override.precio !== FRASCO_REMOVIDO_SENTINEL) {
      delJson.push({ ml, tipo, precio: override.precio, stock: override.stock ?? null });
    }
  }

  return {
    ...producto,
    // El sentinel marca un formato "sacado" desde /admin (ver
    // quitarFrascoCompleto): aunque venga del JSON, no se muestra.
    formatos: delJson.filter((f) => f.precio !== FRASCO_REMOVIDO_SENTINEL),
  };
}

export async function getAllProducts() {
  const overrides = await getFormatoOverrides();
  return perfumes.map((p) => conFormatosMezclados(p, overrides));
}

export async function getFeaturedProducts() {
  const productos = await getAllProducts();
  return productos.filter((p) => p.destacado);
}

export async function getProductBySlug(slug) {
  const producto = perfumes.find((p) => p.id === slug) ?? null;
  if (!producto) return null;
  const overrides = await getFormatoOverrides();
  return conFormatosMezclados(producto, overrides);
}
