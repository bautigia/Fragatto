import { formatPrecio } from "@/lib/products";
import { CONFIG } from "@/lib/config";

export default function ComboCard({ combo }) {
  const whatsappHref = CONFIG.urlWhatsapp(CONFIG.mensajeWhatsappCombo(combo));

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-paper-soft p-8">
      <span className="text-xs tracked-caps text-accent">{combo.cantidadDecants} decants de 5ml</span>
      <h3 className="font-display text-2xl tracked-caps text-ink">{combo.nombre}</h3>
      <p className="text-sm text-ink-soft">{combo.descripcion}</p>
      <div className="mt-2 flex flex-col items-start gap-4">
        <span className="font-display text-xl text-ink">{formatPrecio(combo.precio)}</span>
        {combo.disponible === false ? (
          <span className="w-full cursor-not-allowed rounded-full border border-line px-5 py-2.5 text-center text-sm font-medium text-ink-soft/60">
            Agotado
          </span>
        ) : (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass w-full px-5 py-2.5 text-center text-sm font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Armar este combo
          </a>
        )}
      </div>
    </div>
  );
}
