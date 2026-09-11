import { after } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cliente sin sesión/cookies: alcanza para un insert anónimo, y evita la
// restricción de Next.js de no poder leer cookies() dentro de after()
// cuando se llama desde un Server Component.
function clienteAnonimo() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Registra una visita sin bloquear el render de la página: se ejecuta
// después de que la respuesta ya salió (after()), y si falla no rompe nada.
export function registrarVisita(tipo, productoId = null) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

  after(async () => {
    try {
      const supabase = clienteAnonimo();
      await supabase.from("page_views").insert({ tipo, producto_id: productoId });
    } catch {
      // La analítica nunca debe romper el sitio.
    }
  });
}

export async function getVisitStats() {
  const vacio = { semana: 0, mes: 0, masVistos: [] };
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return vacio;

  try {
    const supabase = await createServerClient();
    const ahora = new Date();
    const inicioSemana = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

    const [semanaRes, mesRes, vistosRes] = await Promise.all([
      supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", inicioSemana),
      supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", inicioMes),
      supabase
        .from("page_views")
        .select("producto_id")
        .eq("tipo", "producto")
        .gte("created_at", inicioMes),
    ]);

    const conteoPorProducto = new Map();
    for (const fila of vistosRes.data ?? []) {
      if (!fila.producto_id) continue;
      conteoPorProducto.set(fila.producto_id, (conteoPorProducto.get(fila.producto_id) ?? 0) + 1);
    }
    const masVistos = Array.from(conteoPorProducto.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      semana: semanaRes.count ?? 0,
      mes: mesRes.count ?? 0,
      masVistos,
    };
  } catch {
    return vacio;
  }
}
