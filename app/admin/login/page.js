"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-semibold">Fragatto — Admin</h1>
        <p className="mb-6 text-sm text-black/60">Iniciá sesión para editar stock y precios.</p>

        <label className="mb-4 flex flex-col gap-1 text-sm">
          Mail
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#476498]"
          />
        </label>

        <label className="mb-6 flex flex-col gap-1 text-sm">
          Contraseña
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#476498]"
          />
        </label>

        {state?.error && <p className="mb-4 text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#476498] px-4 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
        >
          {pending ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
