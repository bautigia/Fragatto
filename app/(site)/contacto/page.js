import { CONFIG } from "@/lib/config";
import { registrarVisita } from "@/lib/analytics";

export const metadata = {
  title: "Contacto | Fragatto",
  description: "Coordiná tu pedido de decants por WhatsApp con Fragatto.",
};

export const revalidate = 0;

export default function ContactoPage() {
  registrarVisita("contacto");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
      <span className="text-xs uppercase tracking-[0.16em] text-accent">Contacto</span>
      <h1 className="mt-3 font-display text-4xl leading-tight tracked-caps text-ink sm:text-5xl">
        Coordinemos tu pedido.
      </h1>
      <p className="mt-6 max-w-[55ch] text-ink-soft">
        La forma más rápida de consultar disponibilidad, coordinar el envío o resolver cualquier duda
        es por WhatsApp. Respondemos personalmente cada mensaje.
      </p>

      <a
        href={CONFIG.urlWhatsapp(CONFIG.mensajeWhatsappGenerico)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-glass mt-8 inline-flex items-center px-6 py-3 text-sm font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
      >
        Escribir por WhatsApp
      </a>

      <div className="mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-2">
        <div>
          <h2 className="text-xs uppercase tracking-[0.14em] text-ink-soft">Horario de atención</h2>
          <p className="mt-2 text-ink">{CONFIG.horario}</p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.14em] text-ink-soft">Envíos</h2>
          <p className="mt-2 text-ink">{CONFIG.envios}</p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.14em] text-ink-soft">Ubicación</h2>
          <p className="mt-2 text-ink">{CONFIG.direccion}</p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.14em] text-ink-soft">Instagram</h2>
          <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="mt-2 block text-ink transition-colors hover:text-accent">
            {CONFIG.instagram.replace("https://", "")}
          </a>
        </div>
      </div>
    </div>
  );
}
