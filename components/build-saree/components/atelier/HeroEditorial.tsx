const FEATURES = [
  {
    title: "Authentic Mysore Silk",
    copy: "Pure. Certified. Timeless.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 3c2.8 3.2 7 6.4 7 10.2A7 7 0 1 1 5 13.2C5 9.4 9.2 6.2 12 3Z" />
        <path d="M12 13.5v4" />
      </svg>
    ),
  },
  {
    title: "Real-time Preview",
    copy: "Every change appears instantly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 3v3M12 18v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    ),
  },
  {
    title: "Heritage Craftsmanship",
    copy: "Designed by you. Woven by us.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h16" />
        <path d="M8 5v14M16 5v14" />
      </svg>
    ),
  },
];

export function HeroEditorial() {
  return (
    <div className="atelier-editorial">
      <p className="atelier-eyebrow">
        Mysore Silk
        <br />
        Atelier
      </p>
      <h1 className="atelier-headline">
        <em>Build Your</em>
        <span>Saree</span>
      </h1>
      <p className="atelier-body">
        Design a saree that reflects your story. Choose your colour, border, pallu and zari —
        woven live on the silk.
      </p>

      <ul className="atelier-features">
        {FEATURES.map((f) => (
          <li key={f.title} className="atelier-feature">
            <span className="atelier-feature-icon">{f.icon}</span>
            <span className="atelier-feature-copy">
              <strong>{f.title}</strong>
              <span>{f.copy}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
