import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import ComboCard from "@/components/ComboCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAllProducts } from "@/lib/catalog";
import { getAllCombos } from "@/lib/combos";
import { registrarVisita } from "@/lib/analytics";

export const metadata = {
  title: "Catálogo | Fragatto",
  description: "Decants y frascos completos de perfumes originales.",
};

export const revalidate = 0;

export default async function CatalogoPage() {
  registrarVisita("catalogo");
  const [productos, combos] = await Promise.all([getAllProducts(), getAllCombos()]);

  return (
    <div className="relative">
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Image src="/images/fondo-catalogo.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-paper/35" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="mb-10 flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.16em] text-accent">Catálogo</span>
          <h1 className="font-display text-4xl leading-tight tracked-caps text-ink">Todos los perfumes</h1>
          <p className="max-w-[60ch] text-ink-soft">
            {productos.length} perfumes disponibles en decant, listos para sumar a tu selección.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <span className="text-xs tracked-caps text-accent">Perfumes</span>
          <h2 className="font-display text-2xl leading-tight tracked-caps text-ink">Todo el catálogo</h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {productos.map((producto, i) => (
            <RevealOnScroll key={producto.id} delay={(i % 3) * 90}>
              <ProductCard producto={producto} />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <section className="mt-16">
            <div className="mb-6 flex flex-col gap-2">
              <span className="text-xs tracked-caps text-accent">Combos</span>
              <h2 className="font-display text-2xl leading-tight tracked-caps text-ink">
                Armados pensados para vos
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {combos.map((combo) => (
                <ComboCard key={combo.id} combo={combo} />
              ))}
            </div>
          </section>
        </RevealOnScroll>
      </div>
    </div>
  );
}
