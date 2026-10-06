"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Emblem from "./Emblem";

type HeaderProps = {
  variant?: "home" | "atelier" | "heritage";
  current?: "your-saree" | "heritage" | "sarees";
};

const homeLinks = [
  { href: "/#collection", label: "Collections" },
  { href: "/sarees", label: "Sarees", key: "sarees" as const },
  { href: "/#silk", label: "Our Craft" },
  { href: "/your-saree", label: "Build Your Saree", key: "your-saree" as const },
  { href: "/heritage", label: "Heritage", key: "heritage" as const },
];

export default function Header({ variant = "home", current }: HeaderProps) {
  const [scrolled, setScrolled] = useState(variant === "atelier" || variant === "heritage");
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = homeLinks;
  const variantClass =
    variant === "atelier" ? " nav--atelier" : variant === "heritage" ? " nav--heritage" : "";

  useEffect(() => {
    if (variant === "atelier" || variant === "heritage") {
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
        className={`nav${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}${variantClass}`}
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
          {variant !== "atelier" ? (
            <>
              <span className="nav__divider" aria-hidden="true" />
              <Link href="/your-saree" className="nav__text">
                Personalize
              </Link>
            </>
          ) : null}
          <Link href="/profile" className="icon-btn" aria-label="Account">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 19c1.4-3.2 3.8-4.7 6.5-4.7s5.1 1.5 6.5 4.7" />
            </svg>
          </Link>
          <button type="button" className="icon-btn" aria-label="Bag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
            <Link href="/your-saree" onClick={() => setMenuOpen(false)}>
              Personalize
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
