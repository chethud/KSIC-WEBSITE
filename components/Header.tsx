"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Emblem from "./Emblem";

type HeaderProps = {
  variant?: "home" | "atelier";
  current?: "your-saree" | "heritage";
};

const homeLinks = [
  { href: "/#collection", label: "Collections" },
  { href: "/#categories", label: "Sarees" },
  { href: "/#categories", label: "Men" },
  { href: "/#silk", label: "Our Craft" },
  { href: "/heritage", label: "Heritage", key: "heritage" as const },
  { href: "/#heritage", label: "Stories" },
];

export default function Header({ variant = "home", current }: HeaderProps) {
  const [scrolled, setScrolled] = useState(variant === "atelier");
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links =
    current === "your-saree"
      ? [
          { href: "/#collection", label: "Collections" },
          { href: "/#categories", label: "Sarees" },
          { href: "/your-saree", label: "Your Saree", key: "your-saree" as const },
          { href: "/heritage", label: "Heritage", key: "heritage" as const },
          { href: "/#heritage", label: "Stories" },
        ]
      : homeLinks;

  useEffect(() => {
    if (variant === "atelier") {
      setScrolled(true);
      return;
    }

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 140 && y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  return (
    <>
      <header
        className={`nav${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}${
          variant === "atelier" ? " nav--atelier" : ""
        }`}
      >
        <Link href="/" className="nav__brand" aria-label="Mysore Silk home">
          <Emblem />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              className={"key" in link && link.key === current ? "is-current" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <button type="button" className="icon-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
              <circle cx="11" cy="11" r="6.2" />
              <path d="M16.2 16.2 20 20" />
            </svg>
          </button>
          <button type="button" className="icon-btn" aria-label="Account">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 19c1.4-3.2 3.8-4.7 6.5-4.7s5.1 1.5 6.5 4.7" />
            </svg>
          </button>
          <button type="button" className="icon-btn" aria-label="Bag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
              <path d="M6.5 7.5h11l-.9 11.2H7.4L6.5 7.5z" />
              <path d="M9 7.5V6.4a3 3 0 0 1 6 0v1.1" />
            </svg>
          </button>
          <button
            type="button"
            className="nav__menu"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="drawer">
          <nav>
            {links.map((link) => (
              <Link key={`m-${link.label}`} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
