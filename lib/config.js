import { formatPrecio } from "@/lib/products";

// Configuración central del negocio. Único lugar para tocar datos de
// contacto y textos generales: no hace falta editar el resto del sitio.
export const CONFIG = {
  nombreNegocio: "Fragatto",
  eslogan: "Probá. Descubrí. Elegí.",

  whatsappNumber: "5492213189778",

  // ID del Meta Pixel (dato público, se ve en el código de cualquier página).
  // Vive acá y no en una variable de entorno para que cualquier build lo
  // incluya, se haga desde donde se haga el deploy. Solo carga en producción.
  metaPixelId: "1114193034606444",

  instagram: "https://www.instagram.com/fragatto.ar/",
  direccion: "Dirección a confirmar",
  horario: "Lunes a sábado, de 10 a 19 hs",
  envios: "Envíos a todo el país. Retiro en punto de entrega a coordinar.",

  mensajeWhatsappGenerico:
    "¡Hola! 👋 Te escribo desde la web de Fragatto ✨, quería hacerte una consulta.",

  // Mensaje para consultar un formato puntual desde la ficha de producto.
  mensajeWhatsappProducto(producto, formato, cantidad = 1) {
    const formatoTexto = formato.tipo === "decant" ? `Decant de ${formato.ml}ml` : `Frasco de ${formato.ml}ml`;
    const cantidadTexto = cantidad > 1 ? ` x${cantidad}` : "";
    const total = formatPrecio(formato.precio * cantidad);
    const regaloTexto = formato.tipo === "frasco completo" ? `\n🎁 Decant de regalo a elección` : "";
    return (
      `¡Hola! 👋 Quiero consultar por:\n\n` +
      `🧴 ${producto.nombre} (${producto.marca})\n` +
      `📦 ${formatoTexto}${cantidadTexto}\n` +
      `💰 ${total}${regaloTexto}\n\n` +
      `¿Está disponible? ✨`
    );
  },

  // Mensaje para consultar por todo lo que el visitante juntó en su selección.
  mensajeWhatsappCarrito(items) {
    if (!items.length) return this.mensajeWhatsappGenerico;
    const lineas = items
      .map((item) => {
        const formatoTexto = item.tipo === "decant" ? "Decant" : "Frasco";
        return `🧴 ${item.nombre} (${item.marca}) · ${formatoTexto} ${item.ml}ml x${item.cantidad} · ${formatPrecio(item.precio * item.cantidad)}`;
      })
      .join("\n");
    const total = formatPrecio(items.reduce((sum, item) => sum + item.precio * item.cantidad, 0));
    const hayFrasco = items.some((item) => item.tipo === "frasco completo");
    const regaloTexto = hayFrasco ? `\n\n🎁 Decant de regalo a elección por cada frasco completo` : "";
    return (
      `¡Hola! 👋 Quiero llevarme esta selección de Fragatto:\n\n${lineas}\n\n` +
      `💰 Total estimado: ${total}${regaloTexto}\n\n` +
      `¿Me confirmás disponibilidad y coordinamos el envío? 🚚✨`
    );
  },

  // Mensaje para consultar por un combo armado.
  mensajeWhatsappCombo(combo) {
    return (
      `¡Hola! 👋 Quiero armar este combo de Fragatto 🎁\n\n` +
      `🎁 ${combo.nombre}\n` +
      `💰 ${formatPrecio(combo.precio)}\n\n` +
      `¿Confirmamos y coordinamos el pedido? 🚚✨`
    );
  },

  // Mensaje para pedir una fragancia que no está en el catálogo.
  mensajeWhatsappEncargo() {
    return (
      `¡Hola! 👋 No encontré la fragancia que busco en el catálogo de Fragatto ✨\n\n` +
      `¿Hacen pedidos por encargo? Te cuento cuál es la que quiero.`
    );
  },

  urlWhatsapp(mensaje) {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
  },
};
