"use client";

import { createContext, useContext, useRef } from "react";

const LogoIntroContext = createContext(null);

// Refs compartidas entre el Navbar y el LogoIntro de la home: el LogoIntro
// escribe directamente sobre el DOM del navbar (opacity) y lee la posición
// del link de marca para saber a dónde tiene que "aterrizar" el logo grande.
export function LogoIntroProvider({ children }) {
  const navRef = useRef(null);
  const brandRef = useRef(null);
  // true una vez que el logo grande terminó de aterrizar en la navbar: hasta
  // entonces el Navbar no debe tocar su propio scroll (esconderse/achicarse),
  // porque ScrubHero ya está animando esa misma barra.
  const introSettledRef = useRef(false);

  return (
    <LogoIntroContext.Provider value={{ navRef, brandRef, introSettledRef }}>
      {children}
    </LogoIntroContext.Provider>
  );
}

export function useLogoIntroRefs() {
  return useContext(LogoIntroContext);
}
