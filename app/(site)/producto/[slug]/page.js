import { notFound } from "next/navigation";
import ProductoDetalle from "@/components/ProductoDetalle";
import { getProductBySlug } from "@/lib/catalog";
import { registrarVisita } from "@/lib/analytics";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const producto = await getProductBySlug(slug);
  if (!producto) return {};
  return {
    title: `${producto.nombre} | ${producto.marca} | Fragatto`,
    description: producto.descripcion,
  };
}

export default async function ProductoPage({ params }) {
  const { slug } = await params;
  const producto = await getProductBySlug(slug);
  if (!producto) notFound();

  registrarVisita("producto", producto.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10 lg:py-20">
      <ProductoDetalle producto={producto} />
    </div>
  );
}
