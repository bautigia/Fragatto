export const metadata = {
  title: "Admin | Fragatto",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f4f1] font-sans text-[#1a1a1a] antialiased">
      {children}
    </div>
  );
}
