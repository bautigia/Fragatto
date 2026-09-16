import Image from "next/image";
import CatalogoClient from "@/components/CatalogoClient";
import ComboCarousel from "@/components/ComboCarousel";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAllProducts } from "@/lib/catalog";
import { getAllCombos } from "@/lib/combos";
import { registrarVisita } from "@/lib/analytics";
import { CONFIG } from "@/lib/config";

export const metadata = {
  title: "Catálogo | Fragatto",
  description: "Decants y frascos completos de perfumes originales.",
};

export const revalidate = 0;

export default async function CatalogoPage() {
  registrarVisita("catalogo");
  const [productos, combos] = await Promise.all([getAllProducts(), getAllCombos()]);
  const whatsappEncargoHref = CONFIG.urlWhatsapp(CONFIG.mensajeWhatsappEncargo());

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
          <p className="max-w-[60ch] text-ink-soft">Elegí el formato que buscás.</p>
        </div>

        <CatalogoClient productos={productos} />

        <RevealOnScroll>
          <section className="mt-16">
            <div className="mb-6 flex flex-col gap-2">
              <span className="text-xs tracked-caps text-accent">Combos</span>
              <h2 className="font-display text-2xl leading-tight tracked-caps text-ink">
                Armados pensados para vos
              </h2>
            </div>
            <ComboCarousel combos={combos} />
          </section>
        </RevealOnScroll>

        <RevealOnScroll>
          <section
            id="pedido-por-encargo"
            className="panel-glass mt-16 scroll-mt-28 px-6 py-12 lg:px-10 lg:py-14"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="flex flex-col gap-3">
                <h2 className="font-display text-2xl leading-tight tracked-caps text-ink lg:text-3xl">
                  ¿No encontraste tu fragancia?
                </h2>
                <p className="max-w-[48ch] text-ink-soft">
                  Si buscás un perfume que no está en el catálogo, contanos cuál es. Lo conseguimos y te
                  avisamos apenas esté listo.
                </p>
              </div>
              <a
                href={whatsappEncargoHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass inline-flex shrink-0 px-6 py-3 text-sm font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Pedila por WhatsApp
              </a>
            </div>
          </section>
        </RevealOnScroll>
      </div>
    </div>
  );
}
