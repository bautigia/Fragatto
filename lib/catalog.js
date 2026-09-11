import perfumes from "@/data/perfumes.json";
import { getFormatoOverrides, claveFormatoOverride } from "@/lib/overrides";

function conFormatosMezclados(producto, overrides) {
  return {
    ...producto,
    formatos: producto.formatos.map((f) => {
      const override = overrides.get(claveFormatoOverride(producto.id, f.ml, f.tipo));
      return {
        ...f,
        precio: override?.precio ?? f.precio,
        stock: override?.stock ?? null,
      };
    }),
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
