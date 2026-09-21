// Meta Pixel: helper client-safe para disparar eventos. Si el pixel no está
// cargado (sin ID configurado, o el navegador lo bloquea), no hace nada.
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function track(evento, params) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) window.fbq("track", evento, params);
  else window.fbq("track", evento);
}
