import { IconDecant } from "@/components/icons";

const MENSAJE = "Comprando un frasco completo, te llevás un decant de regalo a elección";
const REPETICIONES = 8;

function Grupo({ hidden }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {Array.from({ length: REPETICIONES }).map((_, i) => (
        <span key={i} className="flex shrink-0 items-center gap-4 px-6">
          <span className="text-xs tracked-caps text-ink sm:text-sm">{MENSAJE}</span>
          <IconDecant className="h-4 w-4 shrink-0 text-ink/60" />
        </span>
      ))}
    </div>
  );
}

export default function PromoMarquee() {
  return (
    <div className="w-full overflow-hidden bg-[#476498] py-3">
      <span className="sr-only">{MENSAJE}.</span>
      <div className="flex w-max items-center" style={{ animation: "marquee-scroll 42s linear infinite" }}>
        <Grupo />
        <Grupo hidden="true" />
      </div>
    </div>
  );
}
