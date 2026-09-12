import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Fragatto | Perfumes & Decants",
  description:
    "Probá. Descubrí. Elegí. Decants de 5ml y perfumes 100% originales, con envíos a todo el país.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${nunitoSans.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col bg-paper font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
