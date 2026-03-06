export function Icon({ name, className, title }) {
  const props = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "square",
    strokeLinejoin: "miter",
    strokeWidth: 2.4,
  };

  const paths = {
    plusSquare: (
      <>
        <rect x="4.5" y="4.5" width="23" height="23" {...props} />
        <path d="M16 10V22" {...props} />
        <path d="M10 16H22" {...props} />
      </>
    ),
    keyboard: (
      <>
        <rect x="4.5" y="8.5" width="23" height="15" {...props} />
        <path d="M8 12H10" {...props} />
        <path d="M12 12H14" {...props} />
        <path d="M16 12H18" {...props} />
        <path d="M20 12H22" {...props} />
        <path d="M8 16H10" {...props} />
        <path d="M12 16H14" {...props} />
        <path d="M16 16H18" {...props} />
        <path d="M20 16H22" {...props} />
        <path d="M10 20H22" {...props} />
      </>
    ),
    link: (
      <>
        <path d="M13 11L11 9a5 5 0 0 0-7 7l2 2" {...props} />
        <path d="M19 21l2 2a5 5 0 0 0 7-7l-2-2" {...props} />
        <path d="M11 21L21 11" {...props} />
      </>
    ),
    copy: (
      <>
        <rect x="11.5" y="6.5" width="14" height="18" {...props} />
        <path d="M8.5 11.5H6.5V25.5H20.5V23.5" {...props} />
      </>
    ),
    user: (
      <>
        <circle cx="16" cy="11.5" r="5" {...props} />
        <path d="M7 25c1.8-4.4 6-6.5 9-6.5s7.2 2.1 9 6.5" {...props} />
      </>
    ),
    question: (
      <>
        <path d="M12 12.75A4.5 4.5 0 0 1 16 10.5c2.6 0 4.5 1.7 4.5 4 0 3.5-4.5 3.7-4.5 7.5" {...props} />
        <path d="M16 27V27.5" {...props} />
      </>
    ),
    trophy: (
      <>
        <path d="M11 6h10v5c0 4.5-3 8-5 8s-5-3.5-5-8V6Z" {...props} />
        <path d="M21 8h4c0 4-2.4 6-5 6" {...props} />
        <path d="M11 8H7c0 4 2.4 6 5 6" {...props} />
        <path d="M16 19v6" {...props} />
        <path d="M11 27h10" {...props} />
      </>
    ),
    refresh: (
      <>
        <path d="M24 10V5h-5" {...props} />
        <path d="M25 16a9 9 0 1 1-2.6-6.4L24 10" {...props} />
      </>
    ),
    logout: (
      <>
        <path d="M14 7H7v18h7" {...props} />
        <path d="M18 11l6 5-6 5" {...props} />
        <path d="M11 16h13" {...props} />
      </>
    ),
    info: (
      <>
        <circle cx="16" cy="16" r="10.5" {...props} />
        <path d="M16 14v7" {...props} />
        <path d="M16 10.5V11" {...props} />
      </>
    ),
  };

  return (
    <svg
      aria-hidden={title ? undefined : true}
      className={className}
      role={title ? "img" : "presentation"}
      viewBox="0 0 32 32"
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
