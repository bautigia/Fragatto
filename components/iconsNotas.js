function base(props) {
  return { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round", ...props };
}

export function IconCitrico(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7" />
    </svg>
  );
}

export function IconFrutal(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 9c-3.6 0-6 2.6-6 6.2C6 19 8.4 21 11 21c.7 0 1.3-.2 1-.2s.3.2 1 .2c2.6 0 5-2 5-5.8C18 11.6 15.6 9 12 9Z" />
      <path d="M12 9c0-2 .8-3.4 2.4-4.4M12 9c0-1.7-.6-3-1.8-4" />
    </svg>
  );
}

export function IconFloral(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="2.1" />
      <path d="M12 9.9c-1.6-1.4-1.8-3.4-.5-4.9 1.5 1 2 2.9 1.4 4.9M14.1 12c1.4-1.6 3.4-1.8 4.9-.5-1 1.5-2.9 2-4.9 1.4M12 14.1c1.6 1.4 1.8 3.4.5 4.9-1.5-1-2-2.9-1.4-4.9M9.9 12c-1.4 1.6-3.4 1.8-4.9.5 1-1.5 2.9-2 4.9-1.4" />
    </svg>
  );
}

export function IconEspeciado(props) {
  return (
    <svg {...base(props)}>
      <circle cx="8.5" cy="9" r="1.3" />
      <circle cx="14.5" cy="7.5" r="1.3" />
      <circle cx="16.5" cy="13" r="1.3" />
      <circle cx="10" cy="15" r="1.3" />
      <circle cx="7" cy="16.5" r="1.3" />
    </svg>
  );
}

export function IconAmaderado(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 21V11" />
      <path d="M12 11 7 6M12 11l5-5M12 15 8.5 11.5M12 15l3.5-3.5" />
      <path d="M12 6V3" />
    </svg>
  );
}

export function IconCuero(props) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="16" height="16" rx="2.4" strokeDasharray="1.6 2.2" />
      <path d="M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5" />
    </svg>
  );
}

export function IconAmbar(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5c2.8 3.6 5 6.9 5 9.8a5 5 0 0 1-10 0c0-2.9 2.2-6.2 5-9.8Z" />
      <path d="M12 11v6" />
    </svg>
  );
}

export function IconGourmand(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 12c-3-3.4-2.4-6.9.3-9 1.6 2.6 1.4 6-1 8.2" />
      <path d="M12 12c3-3.4 2.4-6.9-.3-9-1.6 2.6-1.4 6 1 8.2" />
      <path d="M12 12v9" />
    </svg>
  );
}

export function IconAlmizcle(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 19 12l-7 8.5L5 12l7-8.5Z" />
    </svg>
  );
}

export function IconAcuatico(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 10c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0 3.2 1.4 4.8 0" />
      <path d="M3 15c1.6-1.4 3.2-1.4 4.8 0s3.2 1.4 4.8 0 3.2-1.4 4.8 0 3.2 1.4 4.8 0" />
    </svg>
  );
}

export function IconHerbal(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 21c0-7 0-12 5-16" />
      <path d="M12 15c0-4-2-6-6-7M17 8c0-2.5 1-4 3.5-4.5" />
    </svg>
  );
}

export function IconAromaGenerico(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5v3M6.5 6.5l2 2M17.5 6.5l-2 2" />
      <circle cx="12" cy="14" r="6.5" />
    </svg>
  );
}
