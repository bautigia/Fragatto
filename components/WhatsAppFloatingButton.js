import { CONFIG } from "@/lib/config";

export default function WhatsAppFloatingButton() {
  const href = CONFIG.urlWhatsapp(CONFIG.mensajeWhatsappGenerico);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="btn-glass fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center text-ink transition-transform duration-300 hover:-translate-y-0.5 active:scale-95"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M16.02 3C9.4 3 4.02 8.38 4.02 15c0 2.22.6 4.3 1.65 6.09L4 29l8.1-1.62A11.93 11.93 0 0 0 16.02 27C22.64 27 28 21.62 28 15S22.64 3 16.02 3Zm0 21.8c-1.9 0-3.68-.5-5.22-1.38l-.37-.22-4.8.96.98-4.68-.24-.38a9.72 9.72 0 0 1-1.5-5.1c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8Zm5.37-7.34c-.29-.15-1.73-.86-2-.95-.27-.1-.46-.15-.66.14-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.44.13-.59.13-.13.29-.34.44-.5.15-.17.2-.29.29-.48.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.03c.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.09 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.13-.27-.2-.56-.34Z" />
      </svg>
    </a>
  );
}
