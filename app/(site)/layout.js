import { CartProvider } from "@/context/CartContext";
import { LogoIntroProvider } from "@/context/LogoIntroContext";
import { QuickViewProvider } from "@/context/QuickViewContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import AmbientGlow from "@/components/AmbientGlow";

export default function SiteLayout({ children }) {
  return (
    <>
      <a
        href="#main"
        className="btn-glass fixed left-4 top-4 z-50 -translate-y-20 px-5 py-2.5 text-sm font-medium text-ink transition-transform focus-visible:translate-y-0"
      >
        Saltar al contenido
      </a>
      <AmbientGlow />
      <LogoIntroProvider>
        <CartProvider>
          <QuickViewProvider>
            <div className="relative z-10 flex min-h-full flex-col">
              <Navbar />
              <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
                {children}
              </main>
              <Footer />
            </div>
            <CartDrawer />
            <QuickViewModal />
            <WhatsAppFloatingButton />
          </QuickViewProvider>
        </CartProvider>
      </LogoIntroProvider>
    </>
  );
}
