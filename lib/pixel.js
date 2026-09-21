import { CONFIG } from "@/lib/config";

// Meta Pixel: helper client-safe para disparar eventos. Solo se activa en
// producción, así el tráfico de desarrollo no ensucia las estadísticas. Si el
// pixel no está cargado (sin ID, o el navegador lo bloquea), no hace nada.
export const META_PIXEL_ID = process.env.NODE_ENV === "production" ? CONFIG.metaPixelId : undefined;

export function track(evento, params) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) window.fbq("track", evento, params);
  else window.fbq("track", evento);
}
