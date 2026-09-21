"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CONFIG } from "@/lib/config";
import { track } from "@/lib/pixel";

const CartContext = createContext(null);
const STORAGE_KEY = "fragatto-seleccion";

function sameEntry(a, b) {
  return a.productId === b.productId && a.ml === b.ml && a.tipo === b.tipo;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage no disponible o corrupto: arrancamos con selección vacía.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Falla silenciosa: la selección sigue funcionando en memoria.
    }
  }, [items, hydrated]);

  const addItem = useCallback((entry) => {
    track("AddToCart", {
      content_ids: [entry.productId],
      content_name: entry.nombre,
      content_type: "product",
      value: entry.precio * entry.cantidad,
      currency: "ARS",
    });
    setItems((prev) => {
      const existing = prev.find((i) => sameEntry(i, entry));
      if (existing) {
        return prev.map((i) =>
          sameEntry(i, entry) ? { ...i, cantidad: i.cantidad + entry.cantidad } : i
        );
      }
      return [...prev, entry];
    });
  }, []);

  const removeItem = useCallback((entry) => {
    setItems((prev) => prev.filter((i) => !sameEntry(i, entry)));
  }, []);

  const updateCantidad = useCallback((entry, cantidad) => {
    setItems((prev) =>
      prev.map((i) =>
        sameEntry(i, entry) ? { ...i, cantidad: Math.max(1, cantidad) } : i
      )
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.cantidad, 0),
    [items]
  );

  const totalPrecio = useMemo(
    () => items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
    [items]
  );

  const whatsappUrlCarrito = useMemo(
    () => CONFIG.urlWhatsapp(CONFIG.mensajeWhatsappCarrito(items)),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateCantidad,
      clear,
      totalItems,
      totalPrecio,
      isOpen,
      setIsOpen,
      whatsappUrlCarrito,
    }),
    [items, addItem, removeItem, updateCantidad, clear, totalItems, totalPrecio, isOpen, whatsappUrlCarrito]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
