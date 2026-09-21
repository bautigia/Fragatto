"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, track } from "@/lib/pixel";

export default function MetaPixel() {
  const pathname = usePathname();
  const ultimaRuta = useRef(null);

  // El snippet ya dispara el PageView de la primera carga. Acá cubrimos las
  // navegaciones internas del App Router, que no recargan la página.
  useEffect(() => {
    if (!META_PIXEL_ID) return;
    if (ultimaRuta.current === null) {
      ultimaRuta.current = pathname;
      return;
    }
    if (ultimaRuta.current === pathname) return;
    ultimaRuta.current = pathname;
    track("PageView");
  }, [pathname]);

  // Un solo listener para todos los links a WhatsApp del sitio (botón
  // flotante, footer, contacto, catálogo, combos, ficha y carrito), en vez de
  // convertir cada Server Component en client solo para medir el click.
  useEffect(() => {
    if (!META_PIXEL_ID) return;
    function onClick(e) {
      const link = e.target instanceof Element ? e.target.closest('a[href^="https://wa.me/"]') : null;
      if (link) track("Contact");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!META_PIXEL_ID) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
