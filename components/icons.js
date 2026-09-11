function base(props) {
  return { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round", ...props };
}

export function IconPerfume(props) {
  return (
    <svg {...base(props)}>
      <path d="M9 4h6v3.2c1.5.9 2.5 2.4 2.5 4.3v9a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-2v-9c0-1.9 1-3.4 2.5-4.3V4Z" />
      <path d="M10.2 4V2.6h3.6V4" />
      <path d="M8 12.5h8" />
    </svg>
  );
}

export function IconDecant(props) {
  return (
    <svg {...base(props)}>
      <rect x="10" y="2.5" width="4" height="3.2" rx="0.6" />
      <circle cx="12" cy="1.6" r="0.9" fill="currentColor" stroke="none" />
      <rect x="9" y="5.7" width="6" height="16" rx="2.4" />
      <path d="M9.8 11.5h4.4" />
    </svg>
  );
}

export function IconCombo(props) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="9" width="17" height="11" rx="1.4" />
      <path d="M3.5 13h17" />
      <path d="M12 9v11" />
      <path d="M12 9c-1.4 0-2.6-1-2.6-2.3S9.9 4 11.4 4c1.3 0 2 1 2.6 2.2C14.6 5 15.3 4 16.6 4c1.5 0 2.6 1.2 2.6 2.7S18 9 16.6 9Z" />
    </svg>
  );
}

export function IconEnvio(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7.5" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

export function IconShieldCheck(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5C8 19.5 5 16.5 5 12V6l7-2.5Z" />
      <path d="m9 12 2 2 4-4.2" />
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg {...base(props)}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

export function IconBriefcase(props) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="8" width="18" height="12" rx="1.6" />
      <path d="M8.5 8V6a1.6 1.6 0 0 1 1.6-1.6h3.8A1.6 1.6 0 0 1 15.5 6v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

export function IconDollar(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.5v11M15 9c0-1.4-1.4-2.2-3-2.2s-3 .9-3 2.2 1.4 1.9 3 2.2c1.6.3 3 .9 3 2.2s-1.4 2.1-3 2.1-3-.7-3-2.1" />
    </svg>
  );
}
