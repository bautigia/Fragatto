import Image from "next/image";
import { CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div className="flex flex-col gap-3">
          <Image
            src="/brand/icon-fragatto.png"
            alt={CONFIG.nombreNegocio}
            width={40}
            height={57}
            className="h-12 w-auto self-start"
          />
          <p className="max-w-[28ch] text-sm tracked-caps text-accent">{CONFIG.eslogan}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-ink-soft">
          <span className="text-xs tracked-caps text-ink">Navegación</span>
          <a href="/catalogo" className="w-fit transition-colors hover:text-accent">Catálogo</a>
          <a href="/nosotros" className="w-fit transition-colors hover:text-accent">Nosotros</a>
          <a href="/contacto" className="w-fit transition-colors hover:text-accent">Contacto</a>
        </div>

        <div className="flex flex-col gap-2 text-sm text-ink-soft">
          <span className="text-xs tracked-caps text-ink">Atención</span>
          <span>{CONFIG.horario}</span>
          <span>{CONFIG.direccion}</span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-ink-soft">
          <span className="text-xs tracked-caps text-ink">Contacto</span>
          <a
            href={CONFIG.urlWhatsapp(CONFIG.mensajeWhatsappGenerico)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit transition-colors hover:text-accent"
          >
            WhatsApp
          </a>
          <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="w-fit transition-colors hover:text-accent">
            Instagram
          </a>
        </div>
      </div>
      <div className="border-t border-line px-6 py-5 text-center text-xs text-ink-soft lg:px-10">
        © {new Date().getFullYear()} {CONFIG.nombreNegocio}. Perfumes 100% originales y decants.
      </div>
    </footer>
  );
}
