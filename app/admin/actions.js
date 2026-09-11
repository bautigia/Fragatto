"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function signIn(prevState, formData) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: "Supabase todavía no está configurado (ver .env.example)." };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Mail o contraseña incorrectos." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function requireUser(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado.");
  return user;
}

export async function updateFormato(formData) {
  const supabase = await createClient();
  await requireUser(supabase);

  const productoId = formData.get("productoId");
  const ml = Number(formData.get("ml"));
  const tipo = formData.get("tipo");
  const precio = Number(formData.get("precio"));
  const stockRaw = formData.get("stock");
  const stock = stockRaw === "" || stockRaw === null ? null : Number(stockRaw);

  if (!productoId || !tipo || !Number.isFinite(ml) || !Number.isFinite(precio) || precio < 0) {
    throw new Error("Datos inválidos.");
  }
  if (stock !== null && (!Number.isFinite(stock) || stock < 0)) {
    throw new Error("Stock inválido.");
  }

  const { error } = await supabase.from("formato_precio_stock").upsert(
    {
      producto_id: productoId,
      ml,
      tipo,
      precio,
      stock,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "producto_id,ml,tipo" }
  );
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/producto/[slug]", "page");
  revalidatePath("/");
}

export async function updateCombo(formData) {
  const supabase = await createClient();
  await requireUser(supabase);

  const comboId = formData.get("comboId");
  const precio = Number(formData.get("precio"));
  const disponible = formData.get("disponible") === "on";

  if (!comboId || !Number.isFinite(precio) || precio < 0) {
    throw new Error("Datos inválidos.");
  }

  const { error } = await supabase.from("combo_precio_stock").upsert(
    {
      combo_id: comboId,
      precio,
      disponible,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "combo_id" }
  );
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/");
}
