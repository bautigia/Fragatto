"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { updateFormato, quitarFrascoCompleto } from "@/app/admin/actions";

const FRASCO_ML = 100;
const FRASCO_TIPO = "frasco completo";

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

function BotonQuitarFrasco() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "Sacando…" : "Sacar frasco"}
    </button>
  );
}

function FormularioQuitarFrasco({ producto, formato }) {
  function confirmarAntesDeEnviar(e) {
    const ok = window.confirm(
      `¿Sacar el frasco completo de "${producto.nombre}"? Deja de venderse hasta que lo agregues de nuevo.`
    );
    if (!ok) e.preventDefault();
  }

  return (
    <form action={quitarFrascoCompleto} onSubmit={confirmarAntesDeEnviar}>
      <input type="hidden" name="productoId" value={producto.id} />
      <input type="hidden" name="ml" value={formato.ml} />
      <input type="hidden" name="tipo" value={formato.tipo} />
      <BotonQuitarFrasco />
    </form>
  );
}

function FilaFormato({ producto, formato }) {
  const agotado = formato.stock === 0;
  const esFrascoCompleto = formato.tipo === FRASCO_TIPO;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f5f4f1] px-3 py-2.5">
      <form action={updateFormato} className="flex flex-1 flex-wrap items-center gap-3">
        <input type="hidden" name="productoId" value={producto.id} />
        <input type="hidden" name="ml" value={formato.ml} />
        <input type="hidden" name="tipo" value={formato.tipo} />

        <div className="min-w-[132px]">
          <p className="text-xs font-medium text-black/70">
            {formato.tipo === "decant" ? "Decant" : "Frasco completo"} {formato.ml}ml
          </p>
          {agotado && <p className="text-[11px] font-medium text-red-600">Agotado</p>}
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
            className="w-24 rounded-lg border border-black/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#476498]"
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
            className="w-20 rounded-lg border border-black/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#476498]"
          />
        </label>

        <BotonGuardar />
      </form>

      {esFrascoCompleto && <FormularioQuitarFrasco producto={producto} formato={formato} />}
    </div>
  );
}

function AgregarFrasco({ producto }) {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="self-start rounded-xl border border-dashed border-black/20 px-3 py-2.5 text-xs font-medium text-black/50 transition-colors hover:border-[#476498] hover:text-[#476498]"
      >
        + Agregar frasco completo
      </button>
    );
  }

  return (
    <form
      action={updateFormato}
      className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-[#476498]/40 bg-[#476498]/5 px-3 py-2.5"
    >
      <input type="hidden" name="productoId" value={producto.id} />
      <input type="hidden" name="ml" value={FRASCO_ML} />
      <input type="hidden" name="tipo" value={FRASCO_TIPO} />

      <p className="min-w-[132px] text-xs font-medium text-black/70">Frasco completo {FRASCO_ML}ml</p>

      <label className="flex items-center gap-2 text-xs text-black/60">
        Precio
        <input
          type="number"
          name="precio"
          min="0"
          step="1"
          required
          autoFocus
          className="w-24 rounded-lg border border-black/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#476498]"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-black/60">
        Stock
        <input
          type="number"
          name="stock"
          placeholder="Sin límite"
          min="0"
          step="1"
          className="w-20 rounded-lg border border-black/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#476498]"
        />
      </label>

      <BotonGuardar />

      <button
        type="button"
        onClick={() => setAbierto(false)}
        className="text-xs text-black/40 hover:text-black/60 hover:underline"
      >
        Cancelar
      </button>
    </form>
  );
}

function TarjetaProducto({ producto }) {
  const tieneFrasco = producto.formatos.some((f) => f.tipo === FRASCO_TIPO);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4 sm:flex-row sm:p-5">
      <div className="flex items-center gap-3 sm:w-48 sm:shrink-0 sm:flex-col sm:items-start">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5f4f1] sm:h-28 sm:w-28">
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              sizes="112px"
              className="object-contain p-1.5"
            />
          ) : null}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-black/40">{producto.marca}</p>
          <p className="text-sm font-semibold leading-snug">{producto.nombre}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {producto.formatos.map((formato) => (
          <FilaFormato
            key={`${producto.id}-${formato.ml}-${formato.tipo}`}
            producto={producto}
            formato={formato}
          />
        ))}
        {!tieneFrasco && <AgregarFrasco producto={producto} />}
      </div>
    </div>
  );
}

export default function AdminCatalogo({ productos }) {
  const [busqueda, setBusqueda] = useState("");

  const productosOrdenados = useMemo(
    () =>
      [...productos].sort(
        (a, b) => a.marca.localeCompare(b.marca) || a.nombre.localeCompare(b.nombre)
      ),
    [productos]
  );

  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productosOrdenados;
    return productosOrdenados.filter(
      (p) => p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)
    );
  }, [productosOrdenados, busqueda]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/60">
          Perfumes <span className="text-black/35">({productosFiltrados.length})</span>
        </h2>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o marca…"
          className="w-full max-w-xs rounded-full border border-black/15 bg-white px-4 py-2 text-sm outline-none focus:border-[#476498]"
        />
      </div>

      <div className="flex flex-col gap-3">
        {productosFiltrados.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}

        {productosFiltrados.length === 0 && (
          <p className="rounded-2xl border border-dashed border-black/15 bg-white px-4 py-8 text-center text-sm text-black/50">
            No encontramos perfumes que coincidan con “{busqueda}”.
          </p>
        )}
      </div>
    </section>
  );
}
