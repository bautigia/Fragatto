"use client";

import { useEffect, useRef } from "react";
import { useQuickView } from "@/context/QuickViewContext";
import ProductoDetalle from "./ProductoDetalle";

export default function QuickViewModal() {
  const { producto, isOpen, closeQuickView } = useQuickView();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") closeQuickView();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeQuickView]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeQuickView}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 py-10 ${
          isOpen ? "" : "pointer-events-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeQuickView();
        }}
      >
        {producto && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Vista rápida de ${producto.nombre}`}
            className={`modal-glass relative max-h-[88vh] w-full max-w-4xl overflow-y-auto p-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-10 ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <button
              ref={closeButtonRef}
              onClick={closeQuickView}
              aria-label="Cerrar vista rápida"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
              </svg>
            </button>

            <ProductoDetalle producto={producto} />
          </div>
        )}
      </div>
    </>
  );
}
