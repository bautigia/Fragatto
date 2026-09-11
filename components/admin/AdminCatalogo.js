"use client";

import { useFormStatus } from "react-dom";
import { updateFormato, updateCombo } from "@/app/admin/actions";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-[#476498] px-4 py-1.5 text-xs font-medium text-white transition-opacity disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}

function FilaFormato({ producto, formato }) {
  return (
    <form
      action={updateFormato}
      className="flex flex-wrap items-center gap-3 border-b border-black/5 py-3 last:border-0"
    >
      <input type="hidden" name="productoId" value={producto.id} />
      <input type="hidden" name="ml" value={formato.ml} />
      <input type="hidden" name="tipo" value={formato.tipo} />

      <div className="min-w-[220px] flex-1">
        <p className="text-sm font-medium">{producto.nombre}</p>
        <p className="text-xs text-black/50">
          {producto.marca} · {formato.tipo === "decant" ? "Decant" : "Frasco"} {formato.ml}ml
        </p>
      </div>

      <label className="flex items-center gap-2 text-xs text-black/60">
        Precio
        <input
          type="number"
          name="precio"
          defaultValue={formato.precio}
          min="0"
          step="1"
          required
          className="w-28 rounded-lg border border-black/15 px-2 py-1.5 text-sm outline-none focus:border-[#476498]"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-black/60">
        Stock
        <input
          type="number"
          name="stock"
          defaultValue={formato.stock ?? ""}
          placeholder="Sin límite"
          min="0"
          step="1"
          className="w-24 rounded-lg border border-black/15 px-2 py-1.5 text-sm outline-none focus:border-[#476498]"
        />
      </label>

      <BotonGuardar />
    </form>
  );
}

function FilaCombo({ combo }) {
  return (
    <form
      action={updateCombo}
      className="flex flex-wrap items-center gap-3 border-b border-black/5 py-3 last:border-0"
    >
      <input type="hidden" name="comboId" value={combo.id} />

      <div className="min-w-[220px] flex-1">
        <p className="text-sm font-medium">{combo.nombre}</p>
        <p className="text-xs text-black/50">{combo.cantidadDecants} decants</p>
      </div>

      <label className="flex items-center gap-2 text-xs text-black/60">
        Precio
        <input
          type="number"
          name="precio"
          defaultValue={combo.precio}
          min="0"
          step="1"
          required
          className="w-28 rounded-lg border border-black/15 px-2 py-1.5 text-sm outline-none focus:border-[#476498]"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-black/60">
        <input type="checkbox" name="disponible" defaultChecked={combo.disponible !== false} />
        Disponible
      </label>

      <BotonGuardar />
    </form>
  );
}

export default function AdminCatalogo({ productos, combos }) {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/60">Perfumes</h2>
        <div className="rounded-2xl border border-black/10 bg-white px-4">
          {productos.map((producto) =>
            producto.formatos.map((formato) => (
              <FilaFormato key={`${producto.id}-${formato.ml}-${formato.tipo}`} producto={producto} formato={formato} />
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/60">Combos</h2>
        <div className="rounded-2xl border border-black/10 bg-white px-4">
          {combos.map((combo) => (
            <FilaCombo key={combo.id} combo={combo} />
          ))}
        </div>
      </section>
    </div>
  );
}
