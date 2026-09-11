"use client";

import { useState } from "react";
import Image from "next/image";
import BottleIllustration from "./BottleIllustration";
import { colorDeFamilia } from "@/lib/familias";
import { formatPrecio } from "@/lib/products";
import { iconoDeNota } from "@/lib/notas";
import { useCart } from "@/context/CartContext";
import { CONFIG } from "@/lib/config";

function GrupoNotas({ titulo, notas }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">{titulo}</span>
      <ul className="mt-3 flex flex-col gap-2.5">
        {notas.map((nota) => {
          const Icono = iconoDeNota(nota);
          return (
            <li key={nota} className="flex items-center gap-2 text-ink-soft">
              <Icono className="h-4 w-4 shrink-0 text-accent" />
              <span>{nota}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ProductoDetalle({ producto }) {
  const primerDisponible = producto.formatos.findIndex((f) => f.stock !== 0);
  const [formatoIndex, setFormatoIndex] = useState(Math.max(0, primerDisponible));
  const [cantidad, setCantidad] = useState(1);
  const { addItem } = useCart();

  const formato = producto.formatos[formatoIndex];
  const agotado = formato.stock === 0;

  function handleAgregar() {
    addItem({
      productId: producto.id,
      nombre: producto.nombre,
      marca: producto.marca,
      imagen: producto.imagen,
      ml: formato.ml,
      tipo: formato.tipo,
      precio: formato.precio,
      cantidad,
    });
  }

  const whatsappHref = CONFIG.urlWhatsapp(CONFIG.mensajeWhatsappProducto(producto, formato, cantidad));

  return (
    <div className="grid gap-12 lg:items-start lg:grid-cols-2 lg:gap-20">
      <div className="panel-glass relative aspect-square overflow-hidden">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={`${producto.nombre} de ${producto.marca}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BottleIllustration color={colorDeFamilia(producto.familia)} className="h-72 w-auto" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">{producto.marca}</span>
          <h1 className="mt-1 font-display text-4xl leading-tight tracked-caps text-ink">{producto.nombre}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-ink-soft">
            <span className="rounded-full border border-line px-3 py-1">{producto.familia}</span>
            <span className="rounded-full border border-line px-3 py-1">{producto.concentracion}</span>
          </div>
        </div>

        <p className="max-w-[60ch] text-ink-soft">{producto.descripcion}</p>

        <div className="grid grid-cols-3 gap-6 border-y border-line py-6 text-sm">
          <GrupoNotas titulo="Salida" notas={producto.notas.salida} />
          <GrupoNotas titulo="Corazón" notas={producto.notas.corazon} />
          <GrupoNotas titulo="Fondo" notas={producto.notas.fondo} />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">Elegí tu formato</span>
          <div className="flex flex-wrap gap-2">
            {producto.formatos.map((f, i) => (
              <button
                key={`${f.ml}-${f.tipo}`}
                onClick={() => setFormatoIndex(i)}
                disabled={f.stock === 0}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  f.stock === 0
                    ? "cursor-not-allowed border-line text-ink-soft/50"
                    : i === formatoIndex
                      ? "border-accent bg-accent text-paper"
                      : "border-line text-ink-soft hover:border-accent hover:text-accent"
                }`}
              >
                {f.tipo === "decant" ? "Decant" : "Frasco"} {f.ml}ml · {formatPrecio(f.precio)}
                {f.stock === 0 && " · Agotado"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-line px-4 py-2">
            <button
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              aria-label="Restar unidad"
              className="text-ink transition-colors hover:text-accent"
            >
              −
            </button>
            <span className="w-4 text-center text-sm">{cantidad}</span>
            <button
              onClick={() => setCantidad((c) => c + 1)}
              aria-label="Sumar unidad"
              className="text-ink transition-colors hover:text-accent"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAgregar}
            disabled={agotado}
            className="btn-glass px-6 py-3 text-sm font-medium text-ink transition-transform duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {agotado ? "Agotado" : "Agregar a mi selección"}
          </button>

          {!agotado && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass-ghost px-6 py-3 text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              Consultar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
