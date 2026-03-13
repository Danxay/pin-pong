const s = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "square",
  strokeLinejoin: "miter",
  strokeWidth: 2.4,
};

const icons = {
  plusSquare: (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" {...s} />
      <path d="M16 10V22" {...s} />
      <path d="M10 16H22" {...s} />
    </>
  ),
  keyboard: (
    <>
      <rect x="4.5" y="8.5" width="23" height="15" {...s} />
      <path d="M8 12H10" {...s} />
      <path d="M12 12H14" {...s} />
      <path d="M16 12H18" {...s} />
      <path d="M20 12H22" {...s} />
      <path d="M8 16H10" {...s} />
      <path d="M12 16H14" {...s} />
      <path d="M16 16H18" {...s} />
      <path d="M20 16H22" {...s} />
      <path d="M10 20H22" {...s} />
    </>
  ),
  link: (
    <>
      <path d="M13 11L11 9a5 5 0 0 0-7 7l2 2" {...s} />
      <path d="M19 21l2 2a5 5 0 0 0 7-7l-2-2" {...s} />
      <path d="M11 21L21 11" {...s} />
    </>
  ),
  copy: (
    <>
      <rect x="11.5" y="6.5" width="14" height="18" {...s} />
      <path d="M8.5 11.5H6.5V25.5H20.5V23.5" {...s} />
    </>
  ),
  user: (
    <>
      <circle cx="16" cy="11.5" r="5" {...s} />
      <path d="M7 25c1.8-4.4 6-6.5 9-6.5s7.2 2.1 9 6.5" {...s} />
    </>
  ),
  trophy: (
    <>
      <path d="M11 6h10v5c0 4.5-3 8-5 8s-5-3.5-5-8V6Z" {...s} />
      <path d="M21 8h4c0 4-2.4 6-5 6" {...s} />
      <path d="M11 8H7c0 4 2.4 6 5 6" {...s} />
      <path d="M16 19v6" {...s} />
      <path d="M11 27h10" {...s} />
    </>
  ),
  refresh: (
    <>
      <path d="M24 10V5h-5" {...s} />
      <path d="M25 16a9 9 0 1 1-2.6-6.4L24 10" {...s} />
    </>
  ),
  logout: (
    <>
      <path d="M14 7H7v18h7" {...s} />
      <path d="M18 11l6 5-6 5" {...s} />
      <path d="M11 16h13" {...s} />
    </>
  ),
  info: (
    <>
      <circle cx="16" cy="16" r="10.5" {...s} />
      <path d="M16 14v7" {...s} />
      <path d="M16 10.5V11" {...s} />
    </>
  ),
};

export function Icon({ name, className }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 32 32">
      {icons[name]}
    </svg>
  );
}
