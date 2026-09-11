import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import ScrollParallax from "@/components/ScrollParallax";

export const metadata = {
  title: "Nosotros | Fragatto",
  description: "La historia y la filosofía detrás de Fragatto, perfumería de nicho y decants.",
};

export default function NosotrosPage() {
  return (
    <div className="flex flex-col">
      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden">
        <ScrollParallax speed={0.18} className="absolute inset-0 -top-16 -bottom-16">
          <Image
            src="/images/atomizadores-cayendo.png"
            alt="Atomizadores Fragatto"
            fill
            priority
            className="object-cover object-[65%_center]"
          />
        </ScrollParallax>
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/50 to-paper/10" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-12 lg:px-10">
          <span className="text-xs tracked-caps text-accent">Nosotros</span>
          <h1 className="mt-3 font-display text-4xl leading-tight tracked-caps text-ink sm:text-5xl">
            Perfumería sin apuro.
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-20">
        <RevealOnScroll>
          <div className="flex flex-col gap-6 text-ink-soft">
            <p>
              Fragatto nació de una frustración simple: gastar en un frasco completo de perfume y darte
              cuenta a las dos semanas de que no era para vos. Los decants existen para resolver
              exactamente eso: probar un perfume de verdad, en tu piel, antes de comprometerte con los
              100ml.
            </p>
            <p>
              Cada decant que vendemos sale del mismo frasco original que comprarías en cualquier
              perfumería: no reformulamos, no mezclamos, no inventamos nada. Solo lo fraccionamos con
              cuidado para que puedas construir tu propia colección sin que te sobre ni te falte.
            </p>
            <p>
              Creemos en probar antes de comprar, en tener variedad sin acumular frascos que no volvés a
              usar, y en que conocer un perfume te lleve minutos, no meses de investigación.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-xl tracked-caps text-ink">Originalidad garantizada</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Trabajamos únicamente con frascos originales. Cada decant se etiqueta con el nombre del
              perfume y el mililitraje exacto.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl tracked-caps text-ink">Atención directa</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Sin catálogos gigantes ni respuestas automáticas: coordinamos cada pedido por WhatsApp,
              uno por uno.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
