"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const AUTOPLAY_MS = 3000;
const SWIPE_THRESHOLD = 40;

// Estilo "coverflow": la del medio al frente, las de al lado giradas en 3D
// y más chicas, flotando libres por fuera del marco (sin recorte).
const POSICIONES = {
  0: { transform: "translateX(0) rotateY(0deg) scale(1)", opacity: 1, zIndex: 5 },
  "-1": { transform: "translateX(-32%) rotateY(30deg) scale(0.82)", opacity: 0.8, zIndex: 4 },
  1: { transform: "translateX(32%) rotateY(-30deg) scale(0.82)", opacity: 0.8, zIndex: 4 },
  "-2": { transform: "translateX(-56%) rotateY(40deg) scale(0.66)", opacity: 0.4, zIndex: 3 },
  2: { transform: "translateX(56%) rotateY(-40deg) scale(0.66)", opacity: 0.4, zIndex: 3 },
  fuera: { transform: "scale(0.6)", opacity: 0, zIndex: 1 },
};

function posicionPara(i, actual, total) {
  let off = (i - actual + total) % total;
  if (off > total / 2) off -= total;
  return Math.abs(off) > 2 ? "fuera" : String(off);
}

export default function HeroPromoCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || paused || items.length < 2) return;
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % items.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, items.length]);

  if (!items.length) return null;

  function ir(i) {
    setIndex(((i % items.length) + items.length) % items.length);
  }

  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(delta) > SWIPE_THRESHOLD) ir(index + (delta < 0 ? 1 : -1));
  }

  return (
    <div
      role="group"
      aria-label="Promociones"
      className="relative h-full w-full"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0" style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}>
        {items.map((item, i) => {
          const pos = POSICIONES[posicionPara(i, index, items.length)];
          return (
            <div
              key={item.src ?? item.titulo ?? i}
              aria-hidden={i !== index}
              className="absolute inset-0 overflow-hidden rounded-2xl"
              style={{
                transform: pos.transform,
                opacity: pos.opacity,
                zIndex: pos.zIndex,
                pointerEvents: i === index ? "auto" : "none",
                transformOrigin: "50% 50%",
                transition: "transform 0.6s cubic-bezier(0.22,0.61,0.36,1), opacity 0.6s",
                willChange: "transform",
                backfaceVisibility: "hidden",
                boxShadow: "0 25px 50px -18px rgba(0,0,0,0.7)",
              }}
            >
              {item.src ? (
                <Image src={item.src} alt={item.alt ?? ""} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-white/25 p-4 text-center">
                  <span className="text-[0.65rem] tracked-caps text-accent">Promo</span>
                  <span className="text-sm text-ink-soft">{item.titulo}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {items.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a la promo ${i + 1}`}
              aria-current={i === index}
              onClick={() => ir(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-accent" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
