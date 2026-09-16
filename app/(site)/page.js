import Link from "next/link";
import ScrubHero from "@/components/ScrubHero";
import Decant3D from "@/components/Decant3D";
import ComboCarousel from "@/components/ComboCarousel";
import RevealOnScroll from "@/components/RevealOnScroll";
import { IconPerfume, IconDecant, IconCombo, IconEnvio, IconShieldCheck, IconSearch, IconBriefcase, IconDollar } from "@/components/icons";
import { getAllCombos } from "@/lib/combos";
import { registrarVisita } from "@/lib/analytics";

export const revalidate = 0;

const PANEL = "panel-glass";

const PILARES = [
  { icon: IconPerfume, titulo: "Perfumes", texto: "100% originales" },
  { icon: IconDecant, titulo: "Decants 5ml", texto: "Probá antes de elegir" },
  { icon: IconCombo, titulo: "Combos", texto: "Armados pensados para vos" },
  { icon: IconEnvio, titulo: "Envíos", texto: "A todo el país" },
];

const CHECKLIST = [
  { icon: IconShieldCheck, titulo: "100% Original", texto: "Perfumes originales, no fraccionados." },
  { icon: IconSearch, titulo: "Probá antes de elegir", texto: "Descubrí la fragancia antes de comprar el frasco completo." },
  { icon: IconBriefcase, titulo: "Ideal para llevar", texto: "Tamaño práctico, fácil de transportar." },
  { icon: IconDollar, titulo: "Más accesible", texto: "Probá más fragancias gastando menos." },
];

const PASOS = [
  {
    numero: "01",
    titulo: "Elegí tu fragancia",
    texto: "Recorré el catálogo y encontrá el perfume que querés probar o el combo que más te cierra.",
  },
  {
    numero: "02",
    titulo: "Sumalo a tu selección",
    texto: "Cada decant que agregás queda guardado, aunque cierres la página y vuelvas más tarde.",
  },
  {
    numero: "03",
    titulo: "Confirmamos por WhatsApp",
    texto: "Con un clic armamos un mensaje con todo lo elegido para confirmar stock, precio final y envío.",
  },
];

export default async function Home() {
  registrarVisita("home");
  const combos = await getAllCombos();

  return (
    <div className="flex flex-col gap-8 pb-16 lg:gap-12 lg:pb-28">
      <ScrubHero />

      <RevealOnScroll direction="left">
        <section className={`mx-auto max-w-6xl px-6 py-12 lg:px-14 ${PANEL}`}>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
            {PILARES.map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} className="flex flex-col items-center gap-3 text-center">
                <Icon className="h-7 w-7 text-accent" />
                <span className="text-sm tracked-caps text-ink">{titulo}</span>
                <span className="text-xs text-ink-soft">{texto}</span>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll direction="right">
        <section className={`mx-auto max-w-6xl px-6 py-14 lg:px-14 lg:py-20 ${PANEL}`}>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-3xl leading-tight tracked-caps text-ink">
                ¿Qué es un <span className="text-accent">decant</span>?
              </h2>
              <div className="aspect-square w-full max-w-xs self-center overflow-hidden rounded-2xl border border-line lg:self-start">
                <Decant3D />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <p className="text-ink-soft">
                Un decant es una pequeña cantidad de <span className="text-accent">perfume original</span>,{" "}
                <span className="text-accent">extraída directamente del frasco</span> y envasada en un
                atomizador de 5ml.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {CHECKLIST.map(({ icon: Icon, titulo, texto }) => (
                  <div key={titulo} className="flex gap-3">
                    <Icon className="h-6 w-6 shrink-0 text-accent" />
                    <div>
                      <h3 className="text-sm tracked-caps text-ink">{titulo}</h3>
                      <p className="mt-1 text-sm text-ink-soft">{texto}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper/60 px-5 py-4">
                <IconDecant className="h-6 w-6 shrink-0 text-accent" />
                <p className="text-sm text-ink-soft">
                  <span className="text-ink">5ml = aprox. 70 aplicaciones.</span> Rinde perfecto para
                  probar y decidir.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll direction="left">
        <section className={`mx-auto max-w-6xl px-6 py-14 lg:px-14 lg:py-20 ${PANEL}`}>
          <h2 className="mb-10 font-display text-3xl leading-tight tracked-caps text-ink">Cómo comprar</h2>
          <div className="divide-y divide-line border-y border-line">
            {PASOS.map((paso) => (
              <div key={paso.numero} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="font-display text-2xl text-accent">{paso.numero}</span>
                <div>
                  <h3 className="text-lg tracked-caps text-ink">{paso.titulo}</h3>
                  <p className="mt-1 max-w-[55ch] text-sm text-ink-soft">{paso.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll direction="right">
        <section className={`mx-auto max-w-6xl px-6 py-14 lg:px-14 lg:py-20 ${PANEL}`}>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs tracked-caps text-accent">Combos</span>
              <h2 className="font-display text-3xl leading-tight tracked-caps text-ink">Armados pensados para vos</h2>
            </div>
            <Link href="/catalogo" className="text-sm text-ink-soft transition-colors hover:text-accent">
              Ver catálogo completo →
            </Link>
          </div>
          <ComboCarousel combos={combos} />
        </section>
      </RevealOnScroll>
    </div>
  );
}
