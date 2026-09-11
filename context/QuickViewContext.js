"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const QuickViewContext = createContext(null);

export function QuickViewProvider({ children }) {
  const [producto, setProducto] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openQuickView = useCallback((p) => {
    setProducto(p);
    setIsOpen(true);
  }, []);

  const closeQuickView = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ producto, isOpen, openQuickView, closeQuickView }),
    [producto, isOpen, openQuickView, closeQuickView]
  );

  return <QuickViewContext.Provider value={value}>{children}</QuickViewContext.Provider>;
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView debe usarse dentro de <QuickViewProvider>");
  return ctx;
}
