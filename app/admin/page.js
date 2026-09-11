import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllProducts } from "@/lib/catalog";
import { getAllCombos } from "@/lib/combos";
import { getVisitStats } from "@/lib/analytics";
import { signOut } from "@/app/admin/actions";
import AdminCatalogo from "@/components/admin/AdminCatalogo";
import VisitStats from "@/components/admin/VisitStats";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [productos, combos, visitas] = await Promise.all([
    getAllProducts(),
    getAllCombos(),
    getVisitStats(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Fragatto — Admin</h1>
          <p className="text-sm text-black/60">{user.email}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/70 transition-colors hover:border-black/30"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <VisitStats visitas={visitas} productos={productos} />

      <AdminCatalogo productos={productos} combos={combos} />
    </div>
  );
}
