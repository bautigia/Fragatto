"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrecio } from "@/lib/products";
import { track } from "@/lib/pixel";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateCantidad, clear, totalPrecio, totalItems, whatsappUrlCarrito } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-paper/75 backdrop-blur-2xl shadow-[-30px_0_60px_-30px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Tu selección"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="font-display text-xl text-ink">Tu selección</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="text-ink-soft">Todavía no sumaste ningún decant.</p>
              <p className="text-sm text-ink-soft">
                Elegí un perfume del catálogo y su mililitraje para empezar tu selección.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => {
                return (
                  <li
                    key={`${item.productId}-${item.ml}-${item.tipo}`}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/30">
                      {item.imagen && (
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs uppercase tracking-wide text-ink-soft">{item.marca}</span>
                          <p className="font-display text-base leading-snug text-ink">{item.nombre}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item)}
                          className="shrink-0 text-xs text-ink-soft underline-offset-2 transition-colors hover:text-accent hover:underline"
                        >
                          Quitar
                        </button>
                      </div>
                      <span className="text-sm text-ink-soft">
                        {item.tipo === "decant" ? "Decant" : "Frasco"} {item.ml}ml · {formatPrecio(item.precio)}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() => updateCantidad(item, item.cantidad - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-ink transition-colors hover:border-accent hover:text-accent"
                          aria-label="Restar unidad"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm">{item.cantidad}</span>
                        <button
                          onClick={() => updateCantidad(item, item.cantidad + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-ink transition-colors hover:border-accent hover:text-accent"
                          aria-label="Sumar unidad"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm text-ink-soft">
              <span>Subtotal estimado</span>
              <span className="font-display text-lg text-ink">{formatPrecio(totalPrecio)}</span>
            </div>
            <a
              href={whatsappUrlCarrito}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("InitiateCheckout", {
                  content_ids: items.map((i) => i.productId),
                  content_type: "product",
                  num_items: totalItems,
                  value: totalPrecio,
                  currency: "ARS",
                })
              }
              className="btn-glass flex w-full items-center justify-center px-5 py-3 text-sm font-medium text-ink transition-transform duration-200 active:scale-[0.98]"
            >
              Consultar por WhatsApp
            </a>
            <button
              onClick={clear}
              className="mt-3 w-full text-center text-xs text-ink-soft underline-offset-2 transition-colors hover:text-accent hover:underline"
            >
              Vaciar selección
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
