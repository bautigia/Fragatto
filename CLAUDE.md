@AGENTS.md

# Fragatto | Perfumes & Decants

## Proyecto
Sitio web informativo + carrito de compras para venta de decants (5ml,
extraídos de perfumes 100% originales), frascos completos y combos armados.
Identidad de marca real (logo, paleta, tagline) extraída de @fragatto.ar en
Instagram. Cierre de venta por WhatsApp, sin pasarela de pago.

## Identidad de marca
- **Tagline**: "Probá. Descubrí. Elegí."
- **Logo**: `public/brand/Logo-Fragatto.png` (lockup completo, transparente) y
  `public/brand/icon-fragatto.png` (solo el ícono, recortado del lockup para
  usar en el Navbar/Footer a tamaño chico).
- **Azul de marca**: `#476498` (medido en píxeles del logo original, no es
  una aproximación). Variante clara para hovers/acentos: `#5b7cae`.
- **4 pilares del negocio** (de las historias de Instagram): Perfumes 100%
  originales, Decants 5ml, Combos armados, Envíos a todo el país.
- Los decants son un formato **fijo de 5ml** (no hay variedad de ml). El
  frasco completo es un producto aparte, disponible solo para algunos perfumes.

## Stack
- Next.js (App Router) + React
- Tailwind CSS v4 (tokens de color/tipografía en `app/globals.css` vía `@theme inline`)
- JavaScript (sin TypeScript). Motion con CSS transitions + `IntersectionObserver`
  (`components/RevealOnScroll.js`), sin librería de animación externa.
- El catálogo (nombre, marca, descripción, notas, imagen) vive en
  `data/perfumes.json` y `data/combos.json`, igual que siempre. **Precio y
  stock** son la excepción: viven en Supabase (tablas `formato_precio_stock` /
  `combo_precio_stock`, ver `supabase/schema.sql`) y se mezclan por encima del
  JSON en tiempo de request (`lib/catalog.js`, `lib/combos.js`,
  `lib/overrides.js`). Si Supabase no está configurado (o no hay fila para un
  formato/combo), se usa el precio del JSON y stock "sin límite" — el sitio
  nunca se rompe por falta de Supabase, solo pierde la capacidad de editar.
  Por esto el sitio dejó de ser `output: "export"`: necesita servidor
  (Server Actions, Proxy) para el panel de `/admin`.

## La skill 10k-websites (instalada en `~/.claude/skills/10k-websites`)
Paquete que el usuario pidió instalar y aprender: un pipeline para sitios
"cinematográficos" con video hero generado por IA (Higgsfield) controlado por
scroll, deployado a Hostinger. No usamos ese pipeline (Fragatto es Next.js,
no HTML plano, y no depende de Higgsfield/Hostinger), pero sí adoptamos su
estándar de ingeniería para motion/scroll y su checklist de calidad:
- `references/scrub-pipeline.md`: el estándar de hero con scroll-scrubbing
  (lerp con rAF, bandas de progreso con smoothstep, legibilidad de texto sobre
  imagen, los 5 gates de "hero estático" para mobile/reduced-motion, el piso
  de calidad de accesibilidad, el checklist de autotesteo).
- `references/design-package.md` y `references/prompt-laws.md`: estructura de
  paquete de diseño y las doce leyes de diseño de hero (varias aplican más
  allá del video: paleta sacada del propio mundo del sujeto, nunca negro/blanco
  puro, un elemento señal por sitio, ninguna sección adyacente repite el mismo
  esqueleto de layout).
- El "gate" de copy (Fase 9): grep de rayas largas (—) y palabras corporativas
  genéricas (leverage, seamless, empower, etc.) sobre todo el texto visible.
  Se corrió una vez sobre este proyecto y quedó en cero.

`components/ScrubHero.js` es la adaptación de ese estándar a Fragatto:
mismo concepto (progreso de scroll maneja lo que se ve, con lerp suave y
bandas de aparición con smoothstep) pero sobre dos fotos reales en vez de un
video generado, así que no hace falta Higgsfield ni Hostinger.

## Estructura
```
app/
  layout.js                ← root layout real: solo <html>/<body>, fuentes, metadata global
  (site)/                  ← route group con el chrome público (no aparece en la URL)
    layout.js                ← lo que antes era el body de layout.js: skip link, providers,
                                 AmbientGlow, Navbar/Footer, CartDrawer, QuickViewModal, WhatsApp float
    page.js                   ← Home: ScrubHero, 4 pilares, qué es un decant, cómo comprar, combos, destacados
    catalogo/page.js           ← Catálogo completo con filtros
    producto/[slug]/page.js    ← Ficha de producto (dinámica: `revalidate = 0`, precio/stock en vivo)
    nosotros/page.js           ← Incluye hero fotográfico propio con ScrollParallax
    contacto/page.js
  admin/                    ← panel de admin, layout propio SIN el chrome de (site)
    layout.js                 ← chrome mínimo (sin Navbar/Footer/Cart/WhatsApp)
    login/page.js              ← login (mail + contraseña, Supabase Auth)
    page.js                    ← lista editable de precio/stock (protegida por proxy.js)
    actions.js                 ← Server Actions: signIn, signOut, updateFormato, updateCombo
proxy.js                  ← (raíz del repo, no en app/) protege /admin/**, redirige a /admin/login
                              sin sesión. Se llama `proxy.js` y no `middleware.js`: Next 16 renombró
                              el archivo (misma API, ver node_modules/next/dist/docs si hace falta
                              chequear algo — este Next tiene cambios respecto a versiones previas).
components/
  Navbar.js, Footer.js, CartDrawer.js       ← chrome del sitio (Navbar/CartDrawer son client)
  ProductCard.js, CatalogoClient.js         ← catálogo (CatalogoClient es client, maneja filtros)
  ComboCard.js                              ← tarjeta de combo, consulta directa por WhatsApp
  ProductoDetalle.js                        ← ficha de producto, selector de formato (client)
  BottleIllustration.js                     ← ilustración SVG del atomizador (placeholder de foto real)
  ScrubHero.js                              ← hero de la home con scroll-scrubbing sobre las dos fotos
                                               reales (crossfade + zoom + texto en bandas), ver sección
                                               de la skill 10k-websites más abajo
  ScrollParallax.js                         ← capa de parallax genérica (modos "inview" y "scroll")
  AmbientGlow.js                            ← manchas de luz azul difuminadas, animadas en CSS y con
                                               parallax de scroll (reemplaza el humo de las redes sin
                                               depender de un asset pesado)
  RevealOnScroll.js                         ← wrapper de fade-in al hacer scroll (soporta `delay` para stagger)
  icons.js                                  ← set de íconos de línea a medida (sin librería de íconos)
  WhatsAppFloatingButton.js
components/admin/AdminCatalogo.js  ← UI de /admin: una fila por formato/combo, cada una con su
                                       propio <form> a una Server Action (client component)
context/CartContext.js   ← estado global del carrito, persistido en localStorage
lib/config.js            ← número de WhatsApp, textos, armado de mensajes (incluye combos)
lib/products.js          ← helpers puros y client-safe: formatPrecio, precioDesde, getFilterOptions
                              (¡sin este límite, cualquier import de aquí arrastraría next/headers
                              al bundle del cliente vía CartContext — ver lib/catalog.js)
lib/catalog.js           ← getAllProducts/getProductBySlug: async, mezclan data/perfumes.json con
                              los overrides de Supabase. Solo se importa desde Server Components.
lib/combos.js             ← getAllCombos: mismo patrón que lib/catalog.js pero para combos.json
lib/overrides.js          ← lee formato_precio_stock / combo_precio_stock de Supabase (Map vacío
                              si Supabase no está configurado o la query falla)
lib/supabase/client.js, lib/supabase/server.js  ← factories de cliente Supabase (browser / server)
lib/familias.js          ← color asociado a cada familia olfativa (para el placeholder)
data/perfumes.json       ← fuente de verdad del catálogo salvo precio/stock (ver más arriba)
data/combos.json         ← ídem, combos armados de ejemplo
supabase/schema.sql      ← tablas + RLS para pegar una vez en el SQL Editor de Supabase
public/brand/            ← logo real de la marca (lockup + ícono recortado)
public/images/           ← fotos reales de producto (atomizadores-parados.png, atomizadores-cayendo.png)
```

## Cómo tocar lo del día a día
- **Precio y stock** → los edita el cliente en `/admin` (login con mail/contraseña
  de Supabase Auth), no se tocan más a mano en el JSON. `stock` vacío/null =
  sin límite, `0` = agotado (deshabilita el formato/combo en el sitio), un
  número = cantidad. Si hace falta setup desde cero: crear proyecto en
  Supabase, correr `supabase/schema.sql`, crear el usuario admin en
  Authentication → Users, y cargar `NEXT_PUBLIC_SUPABASE_URL` /
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local` (ver `.env.example`) y en
  las env vars de Netlify.
- **Agregar/editar perfumes** → `data/perfumes.json`. Cada producto tiene
  `formatos` (array de `{ ml, tipo: "decant" | "frasco completo", precio }`;
  el decant siempre es `ml: 5`). `destacado: true` lo muestra en Destacados.
- **Combos** → `data/combos.json` (nombre, cantidad de decants, descripción, precio).
- **WhatsApp y textos generales** → `lib/config.js` (`whatsappNumber` hoy es un
  placeholder, reemplazar por el número real sin espacios ni signos).
- **Colores y tipografías** → `app/globals.css` (`:root` + `@theme inline`).
  Headline/UI en mayúsculas: Jost (`font-display`, clase utilitaria `tracked-caps`
  para el tracking). Body: Outfit (`font-sans`).
- **Fotos reales de producto**: hoy cada producto usa `BottleIllustration.js`
  (SVG generado, color según `lib/familias.js`) en vez de fotos, porque
  arrancamos con catálogo de ejemplo. Cuando haya fotos reales del atomizador,
  reemplazar en `ProductCard.js` y `ProductoDetalle.js` por `next/image`
  apuntando a `public/images/productos/`.
- **Gotcha de Next/Image dentro de `flex-col`**: si un `<Image>` con `w-auto`
  se ve estirado, es porque el padre flex-col lo estira por `align-items:
  stretch`. Agregarle `self-start` (ver `Footer.js`).
- **Antes de mostrar cualquier copy nuevo al usuario**, correr el gate de la
  skill 10k-websites: `grep -rn "—" app components data lib` y el mismo grep
  con las palabras corporativas genéricas listadas arriba. Debe devolver cero.

## Estado del proyecto
- [x] Scaffold Next.js + Tailwind
- [x] Identidad real aplicada (logo, azul de marca, tipografía geométrica, tagline)
- [x] Home, catálogo con filtros, ficha de producto, nosotros, contacto
- [x] Carrito con persistencia en localStorage + checkout por WhatsApp
- [x] Sección de combos (consulta directa, no integrada al carrito de decants)
- [x] Ambiente animado (glow azul) inspirado en el humo de las redes
- [x] Fotos reales de marca aplicadas (paleta, hero con scroll-scrubbing, hero de Nosotros)
- [x] Piso de accesibilidad (skip link, landmark `main`, focus-visible, overflow-x clip, reduced-motion)
- [x] Panel de admin (`/admin`) para que el cliente edite precio y stock sin
      redeploy — código listo, falta que el usuario cree el proyecto de
      Supabase y cargue las credenciales (ver "Cómo tocar" más arriba)
- [ ] Catálogo real (reemplazar `data/perfumes.json` / `combos.json` de ejemplo)
- [ ] Fotos reales del atomizador (reemplazar `BottleIllustration`)
- [ ] Número de WhatsApp real en `lib/config.js`
- [ ] Deploy (Netlify — `netlify.toml` ya está, falta conectar el repo y cargar env vars)
