"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readAccount, type Account } from "@/lib/account";
import { bagUnits, readBag } from "@/lib/bag";
import Emblem from "./Emblem";
import SearchPanel from "./site/SearchPanel";

type HeaderProps = {
  variant?: "home" | "atelier" | "heritage";
  current?: "shop" | "collections" | "experience" | "story" | "journal" | "sarees" | "your-saree" | "heritage";
};

const links = [
  { href: "/sarees", label: "Shop", key: "shop" },
  { href: "/collections", label: "Collections", key: "collections" },
  { href: "/your-saree", label: "Build Your Saree", key: "your-saree" },
  { href: "/heritage", label: "Our Story", key: "heritage" },
  { href: "/journal", label: "Journal", key: "journal" },
] as const;

function currentKey(current?: HeaderProps["current"]) {
  if (current === "sarees") return "shop";
  if (current === "experience") return "your-saree";
  if (current === "story") return "heritage";
  return current;
}

export default function Header({ variant = "home", current }: HeaderProps) {
  const [scrolled, setScrolled] = useState(variant !== "home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [account, setAccount] = useState<Account | null>(null);
  const active = currentKey(current);

  useEffect(() => {
    const syncBag = () => setBagCount(bagUnits(readBag()));
    const syncAccount = () => setAccount(readAccount());
    syncBag();
    syncAccount();
    window.addEventListener("ksic:bag-changed", syncBag);
    window.addEventListener("ksic:account-changed", syncAccount);
    window.addEventListener("storage", syncBag);
    return () => {
      window.removeEventListener("ksic:bag-changed", syncBag);
      window.removeEventListener("ksic:account-changed", syncAccount);
      window.removeEventListener("storage", syncBag);
    };
  }, []);

  useEffect(() => {
    if (variant !== "home") {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const variantClass =
    variant === "atelier" ? " nav--atelier" : variant === "heritage" ? " nav--heritage" : "";

  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}${variantClass}`}>
        <Link href="/" className="nav__brand" aria-label="Mysore Silk home">
          <Emblem />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={link.key === active ? "is-current" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16.5 20 20.5" />
            </svg>
          </button>
          <Link href="/wishlist" className="icon-btn nav__desk" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 19s-6.2-3.7-6.2-8A3.4 3.4 0 0 1 12 8.2 3.4 3.4 0 0 1 18.2 11C18.2 15.3 12 19 12 19Z" />
            </svg>
          </Link>
          <Link href="/bag" className="icon-btn" aria-label={bagCount ? `Bag, ${bagCount} items` : "Bag"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6.5 7.5h11l-.9 11.2H7.4L6.5 7.5z" />
              <path d="M9 7.5V6.4a3 3 0 0 1 6 0v1.1" />
            </svg>
            {bagCount > 0 ? <span className="nav__bag-count">{bagCount}</span> : null}
          </Link>
          <Link href="/account" className="icon-btn nav__desk" aria-label={account ? "Silk Vault" : "Account"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 19c1.4-3.2 3.8-4.7 6.5-4.7s5.1 1.5 6.5 4.7" />
            </svg>
          </Link>
          <button
            type="button"
            className="nav__menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="drawer">
          <nav aria-label="Mobile">
            {links.map((link) => (
              <Link key={`m-${link.href}`} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
            <Link href={account ? "/account" : "/account"} onClick={() => setMenuOpen(false)}>
              {account ? "Silk Vault" : "Login"}
            </Link>
          </nav>
        </div>
      ) : null}

      <nav className="dock" aria-label="Mobile">
        <Link href="/">Home</Link>
        <Link href="/sarees">Shop</Link>
        <Link href="/your-saree">Your Saree</Link>
        {account ? (
          <Link href="/wishlist">Wishlist</Link>
        ) : (
          <button type="button" onClick={() => setSearchOpen(true)}>Search</button>
        )}
        <Link href="/account">{account ? "Vault" : "Account"}</Link>
      </nav>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
