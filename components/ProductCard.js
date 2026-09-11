"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import BottleIllustration from "./BottleIllustration";
import { colorDeFamilia } from "@/lib/familias";
import { precioDesde, formatPrecio } from "@/lib/products";
import { useQuickView } from "@/context/QuickViewContext";

export default function ProductCard({ producto }) {
  const panelRef = useRef(null);
  const tiltRef = useRef(null);
  const glowRef = useRef(null);
  const { openQuickView } = useQuickView();
  const desde = precioDesde(producto);

  function handleClick(e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openQuickView(producto);
  }

  function handleMouseMove(e) {
    const panel = panelRef.current;
    const el = tiltRef.current;
    if (!panel || !el) return;
    const rect = panel.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const rotateY = (x - 0.5) * 14;
    const rotateX = (0.5 - y) * 14;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateY(-6px)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.3), transparent 55%)`;
      glowRef.current.style.opacity = "1";
    }
  }

  function handleMouseLeave() {
    const el = tiltRef.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0px)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }

  return (
    <Link href={`/producto/${producto.id}`} className="group flex flex-col gap-4" onClick={handleClick}>
      <div
        ref={panelRef}
        className="panel-glass relative flex aspect-square items-center justify-center overflow-hidden p-3 [perspective:900px] sm:p-5"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={tiltRef}
          className="relative h-full transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0px)" }}
        >
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={`${producto.nombre} de ${producto.marca}`}
              width={520}
              height={520}
              className="h-full w-auto rounded-xl object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]"
            />
          ) : (
            <BottleIllustration color={colorDeFamilia(producto.familia)} className="h-full w-auto" />
          )}
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300"
            style={{ mixBlendMode: "overlay" }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] tracked-caps text-ink-soft sm:text-xs">
          {producto.marca}
        </span>
        <h3 className="font-display text-base leading-snug tracked-caps text-ink sm:text-xl">
          {producto.nombre}
        </h3>
        <p className="mt-1 text-xs text-ink-soft sm:text-sm">
          {desde === null ? "Agotado" : `Desde ${formatPrecio(desde)}`}
        </p>
      </div>
    </Link>
  );
}
