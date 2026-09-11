"use client";

import { useEffect, useRef } from "react";

export default function ScrollParallax({ children, speed = 0.2, mode = "inview", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let frame = null;

    function update() {
      frame = null;
      if (mode === "scroll") {
        node.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
        return;
      }
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const offset = (viewportCenter - elementCenter) * speed;
      node.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    function onScroll() {
      if (frame === null) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
