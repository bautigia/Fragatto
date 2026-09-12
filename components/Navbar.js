"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLogoIntroRefs } from "@/context/LogoIntroContext";
import { CONFIG } from "@/lib/config";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/catalogo#pedido-por-encargo", label: "Pedí tu fragancia" },
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { navRef, brandRef, introSettledRef } = useLogoIntroRefs();
  const wrapRef = useRef(null);

  // Se achica y se atenúa sutilmente al bajar, y vuelve a su tamaño normal
  // al subir (o cerca del top). En la home no arranca hasta que el logo
  // grande terminó de aterrizar, para no pelearse con esa animación.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let lastY = window.scrollY;
    let rafId = null;

    function apply(hidden) {
      wrap.style.transform = hidden ? "translateY(-6px) scale(0.92)" : "translateY(0px) scale(1)";
      wrap.style.opacity = hidden ? "0.55" : "1";
    }

    function update() {
      rafId = null;
      const y = window.scrollY;

      if (menuOpen || (isHome && !introSettledRef.current)) {
        lastY = y;
        return;
      }

      const delta = y - lastY;
      if (y < 80) {
        apply(false);
      } else if (delta > 4) {
        apply(true);
      } else if (delta < -4) {
        apply(false);
      }
      lastY = y;
    }

    function onScroll() {
      if (rafId === null) rafId = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isHome, menuOpen, introSettledRef]);

  return (
    <div
      ref={wrapRef}
      className="sticky top-3 z-30 w-full origin-top px-3 transition-[transform,opacity] duration-300 ease-out sm:px-6 lg:px-10"
    >
      <header
        ref={navRef}
        style={{
          ...(isHome ? { opacity: 0 } : null),
          borderRadius: menuOpen ? "1.75rem" : "9999px",
        }}
        className="nav-glass mx-auto max-w-6xl"
      >
        <div className="flex items-center justify-between px-5 py-3 lg:px-7">
          <Link href="/" ref={brandRef} aria-label={CONFIG.nombreNegocio} className="flex items-center">
            <Image
              src="/brand/icon-fragatto.png"
              alt=""
              width={28}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Ver mi selección"
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 8h16l-1.4 10.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 8Z" strokeLinejoin="round" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-paper">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menú"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-white/10 px-6 py-4 md:hidden">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-ink-soft transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </div>
  );
}
