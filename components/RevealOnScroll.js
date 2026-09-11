"use client";

import { useEffect, useRef, useState } from "react";

const OFFSETS = {
  up: "translateY(28px)",
  left: "translateX(-56px)",
  right: "translateX(56px)",
};

export default function RevealOnScroll({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : OFFSETS[direction],
      }}
    >
      {children}
    </div>
  );
}
