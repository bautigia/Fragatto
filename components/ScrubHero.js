"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLogoIntroRefs } from "@/context/LogoIntroContext";

const smoothstep = (p, e0, e1) => {
  const t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

// Tramo del scroll del hero (en fracción de k, 0 a 1) donde el logo grande
// se achica y viaja hasta el logo chico de la navbar.
const LOGO_FROM = 0;
const LOGO_TO = 0.09;

export default function ScrubHero() {
  const { navRef, brandRef, introSettledRef } = useLogoIntroRefs();
  const sectionRef = useRef(null);
  const imgBRef = useRef(null);
  const stageRef = useRef(null);
  const logoRef = useRef(null);
  const kickerRef = useRef(null);
  const headlineRef = useRef(null);
  const paragraphRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // El kicker y el título arrancan a aparecer recién cuando el logo grande
    // termina de irse (LOGO_TO), para no pisarse en el centro de la pantalla.
    const parts = [
      { ref: kickerRef, from: LOGO_TO, to: LOGO_TO + 0.12 },
      { ref: headlineRef, from: LOGO_TO + 0.03, to: LOGO_TO + 0.28 },
      { ref: paragraphRef, from: 0.42, to: 0.62 },
      { ref: ctaRef, from: 0.7, to: 0.88 },
    ];

    if (prefersReduced) {
      parts.forEach(({ ref }) => {
        if (!ref.current) return;
        ref.current.style.opacity = "1";
        ref.current.style.transform = "none";
      });
      if (imgBRef.current) imgBRef.current.style.opacity = "0.55";
      if (logoRef.current) logoRef.current.style.opacity = "0";
      if (navRef.current) {
        navRef.current.style.opacity = "1";
        navRef.current.style.transform = "none";
      }
      introSettledRef.current = true;
      return;
    }

    let target = 0;
    let shown = 0;
    let rafId = null;
    let lastTick = 0;
    let logoNaturalHeight = logoRef.current?.offsetHeight || 0;

    function render(k) {
      if (stageRef.current) {
        stageRef.current.style.transform = `scale(${1 + k * 0.06})`;
      }
      if (imgBRef.current) {
        imgBRef.current.style.opacity = String(smoothstep(k, 0.35, 0.78));
      }
      if (logoRef.current) {
        const p = smoothstep(k, LOGO_FROM, LOGO_TO);
        const brandRect = brandRef.current?.getBoundingClientRect();
        if (brandRect && logoNaturalHeight) {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const dx = brandRect.left + brandRect.width / 2 - vw / 2;
          const dy = brandRect.top + brandRect.height / 2 - vh / 2;
          const endScale = Math.max(0.2, brandRect.height / logoNaturalHeight);
          const scale = 1 + (endScale - 1) * p;
          logoRef.current.style.transform = `translate3d(calc(-50% + ${dx * p}px), calc(-50% + ${dy * p}px), 0) scale(${scale})`;
        }
        logoRef.current.style.opacity = String(1 - smoothstep(p, 0.82, 1));
        if (navRef.current) {
          const navP = smoothstep(p, 0.65, 1);
          navRef.current.style.opacity = String(navP);
          navRef.current.style.transform = `translateX(${(1 - navP) * -28}px)`;
          if (navP >= 1) introSettledRef.current = true;
        }
      }
      parts.forEach(({ ref, from, to }) => {
        if (!ref.current) return;
        const p = smoothstep(k, from, to);
        ref.current.style.opacity = String(p);
        ref.current.style.transform = `translateY(${(1 - p) * 16}px)`;
      });
    }

    function tick(now) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const kFactor = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - kFactor, dt / 16.667));
      if (Math.abs(target - shown) < 0.0006) {
        shown = target;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      render(shown);
    }

    function progress() {
      const rect = section.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      if (range <= 0) return 1;
      return Math.min(1, Math.max(0, -rect.top / range));
    }

    function onScroll() {
      target = progress();
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    function onResize() {
      logoNaturalHeight = logoRef.current?.offsetHeight || logoNaturalHeight;
      onScroll();
    }

    render(0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (navRef.current) {
        navRef.current.style.opacity = "1";
        navRef.current.style.transform = "none";
      }
    };
  }, [navRef, brandRef, introSettledRef]);

  return (
    <section ref={sectionRef} className="relative -mt-[74px] h-[calc(260vh+74px)]">
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        <div ref={stageRef} className="absolute inset-0 -top-16 -bottom-16" style={{ willChange: "transform" }}>
          <Image
            src="/images/atomizadores-parados.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div ref={imgBRef} className="absolute inset-0" style={{ opacity: 0 }}>
            <Image src="/images/atomizadores-cayendo.png" alt="" fill className="object-cover" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/55 to-paper/15" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/40 to-transparent" aria-hidden="true" />

        <div
          ref={logoRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 top-1/2 z-20 h-auto w-[82vw] max-w-5xl drop-shadow-[0_0_90px_rgba(111,168,216,0.4)] sm:w-[68vw] lg:w-[54vw]"
          style={{ transform: "translate3d(-50%, -50%, 0)" }}
        >
          <Image
            src="/brand/FRAGATTOTXT.png"
            alt=""
            width={1259}
            height={708}
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="flex max-w-2xl flex-col gap-6">
            <span ref={kickerRef} className="text-xs tracked-caps text-accent" style={{ opacity: 0 }}>
              Probá. Descubrí. Elegí.
            </span>
            <h1
              ref={headlineRef}
              className="font-display text-4xl leading-[1.05] tracked-caps text-ink sm:text-5xl lg:text-[3.4rem]"
              style={{ opacity: 0 }}
            >
              Un espacio para descubrir tu próxima fragancia.
            </h1>
            <p ref={paragraphRef} className="max-w-[52ch] text-ink-soft" style={{ opacity: 0 }}>
              Fragatto decanta perfumes 100% originales en atomizadores de 5ml para que puedas
              probarlos de verdad antes de invertir en el frasco completo. Mismo perfume, mismo
              frasco de origen, en la medida justa.
            </p>
            <div ref={ctaRef} className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
              <Link
                href="/catalogo"
                className="btn-glass px-6 py-3 text-sm font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Ver catálogo
              </Link>
              <Link
                href="/nosotros"
                className="btn-glass-ghost px-6 py-3 text-sm font-medium text-ink transition-colors hover:text-accent"
              >
                Qué es un decant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
