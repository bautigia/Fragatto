"use client";

import { useEffect, useRef, useState } from "react";
import ComboCard from "./ComboCard";
import { IconChevronLeft, IconChevronRight } from "./icons";

const AUTOPLAY_MS = 4500;

export default function ComboCarousel({ combos }) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  function scrollToIndex(i) {
    const card = cardRefs.current[i];
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function pauseAutoplay() {
    setAutoplayPaused(true);
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || autoplayPaused) return;

    const id = setInterval(() => {
      scrollToIndex((indexRef.current + 1) % combos.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoplayPaused, combos.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId = null;

    function syncActiveIndex() {
      rafId = null;
      let closest = 0;
      let closestDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const dist = Math.abs(card.offsetLeft - track.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      indexRef.current = closest;
      setActiveIndex(closest);
    }

    function handleScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(syncActiveIndex);
    }

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [combos.length]);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onPointerDown={pauseAutoplay}
        onWheel={pauseAutoplay}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {combos.map((combo, i) => (
          <div
            key={combo.id}
            ref={(el) => (cardRefs.current[i] = el)}
            className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]"
          >
            <ComboCard combo={combo} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Combo anterior"
          onClick={() => {
            pauseAutoplay();
            scrollToIndex((activeIndex - 1 + combos.length) % combos.length);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {combos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al combo ${i + 1}`}
              aria-current={i === activeIndex}
              onClick={() => {
                pauseAutoplay();
                scrollToIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-accent" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Combo siguiente"
          onClick={() => {
            pauseAutoplay();
            scrollToIndex((activeIndex + 1) % combos.length);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
