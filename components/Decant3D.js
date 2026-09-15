"use client";

import { useEffect, useState } from "react";

export default function Decant3D({ className = "" }) {
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    import("@google/model-viewer");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAutoRotate(!prefersReduced);
  }, []);

  return (
    <model-viewer
      src="/models/decant-5ml.glb"
      alt="Decant Fragatto de 5ml en 3D"
      camera-controls
      interaction-prompt="none"
      shadow-intensity="1"
      exposure="1"
      environment-image="neutral"
      {...(autoRotate ? { "auto-rotate": true, "rotation-per-second": "18deg" } : {})}
      style={{ width: "100%", height: "100%", background: "transparent", touchAction: "pan-y" }}
      className={className}
    />
  );
}
