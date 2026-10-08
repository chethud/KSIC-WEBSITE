"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { readAccount, type Account } from "@/lib/account";
import { bagUnits, readBag } from "@/lib/bag";
import { SITE_NAV, navGroupActive, type NavCurrent } from "@/lib/site-nav";
import Emblem from "./Emblem";
import SearchPanel from "./site/SearchPanel";
import GroupMegaMenu from "./site/GroupMegaMenu";
import ShopMegaMenu from "./site/ShopMegaMenu";

type HeaderProps = {
  variant?: "home" | "atelier" | "heritage";
  current?: NavCurrent;
};

export default function Header({ variant = "home", current }: HeaderProps) {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(variant !== "home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);
  const [account, setAccount] = useState<Account | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [drawerGroup, setDrawerGroup] = useState<string | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navId = useId();
  const activeGroup = navGroupActive(current, pathname);
  const shopHighlighted = openGroup === "shop" || activeGroup === "shop";
  const openNavGroup = SITE_NAV.find((group) => group.id === openGroup);

  const cancelCloseMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = (id: string) => {
    cancelCloseMenu();
    setOpenGroup(id);
  };

  const scheduleCloseMenu = () => {
    cancelCloseMenu();
    closeTimerRef.current = setTimeout(() => {
      setOpenGroup(null);
      closeTimerRef.current = null;
    }, 220);
  };

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
    if (!accountOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenGroup(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!openGroup) return;
    const onPointer = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [openGroup]);

  useEffect(() => {
    return () => cancelCloseMenu();
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

  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
    setDrawerGroup(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const variantClass =
    variant === "atelier" ? " nav--atelier" : variant === "heritage" ? " nav--heritage" : "";

  return (
    <>
      <header
        ref={headerRef}
        className={`nav nav--luxury${scrolled ? " is-scrolled" : ""}${openGroup ? " is-menu-open" : ""}${variantClass}`}
        onMouseEnter={cancelCloseMenu}
        onMouseLeave={scheduleCloseMenu}
      >
        <Link href="/" className="nav__brand" aria-label="Mysore Silk home">
          <Emblem />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {SITE_NAV.map((group) => {
            const hasChildren = Boolean(group.children?.length);
            const isOpen = openGroup === group.id;
            const isCurrent = activeGroup === group.id || (group.id === "shop" && shopHighlighted);
            const panelId = `${navId}-${group.id}`;

            if (!hasChildren) {
              return (
                <Link
                  key={group.id}
                  href={group.href || "/"}
                  className={isCurrent ? "is-current" : undefined}
                  onMouseEnter={() => {
                    cancelCloseMenu();
                    setOpenGroup(null);
                  }}
                >
                  {group.label}
                </Link>
              );
            }

            return (
              <div
                key={group.id}
                className={`nav__item${isOpen ? " is-open" : ""}${isCurrent ? " is-current" : ""}`}
                onMouseEnter={() => openMenu(group.id)}
                onFocusCapture={() => openMenu(group.id)}
              >
                <button
                  type="button"
                  className="nav__trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => (isOpen ? scheduleCloseMenu() : openMenu(group.id))}
                >
                  {group.label}
                </button>
              </div>
            );
          })}
        </nav>

        {openNavGroup?.children?.length ? (
          <div
            id={`${navId}-${openNavGroup.id}`}
            className={`nav__mega${openNavGroup.id === "shop" ? "" : " nav__mega--group"} is-open`}
            onMouseEnter={cancelCloseMenu}
          >
            {openNavGroup.id === "shop" ? (
              <ShopMegaMenu onNavigate={() => setOpenGroup(null)} />
            ) : (
              <GroupMegaMenu
                groupId={openNavGroup.id}
                links={openNavGroup.children}
                onNavigate={() => setOpenGroup(null)}
              />
            )}
          </div>
        ) : null}

        <div className="nav__actions">
          <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16.5 20 20.5" />
            </svg>
          </button>
          <Link href="/wishlist" className="icon-btn nav__desk" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35">
              <path d="M12 19s-6.2-3.7-6.2-8A3.4 3.4 0 0 1 12 8.2 3.4 3.4 0 0 1 18.2 11C18.2 15.3 12 19 12 19Z" />
            </svg>
          </Link>
          <Link href="/bag" className="icon-btn" aria-label={bagCount ? `Bag, ${bagCount} items` : "Bag"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35">
              <path d="M6.5 7.5h11l-.9 11.2H7.4L6.5 7.5z" />
              <path d="M9 7.5V6.4a3 3 0 0 1 6 0v1.1" />
            </svg>
            {bagCount > 0 ? <span className="nav__bag-count">{bagCount}</span> : null}
          </Link>
          <div className="nav__account" ref={accountRef}>
            <button
              type="button"
              className="icon-btn nav__desk"
              aria-label="Account"
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5.5 19c1.4-3.2 3.8-4.7 6.5-4.7s5.1 1.5 6.5 4.7" />
              </svg>
            </button>
            {accountOpen ? (
              <div className="nav__account-menu" role="menu">
                <Link href="/account" role="menuitem" onClick={() => setAccountOpen(false)}>
                  Profile
                </Link>
                <Link href="/orders" role="menuitem" onClick={() => setAccountOpen(false)}>
                  Order history
                </Link>
                <Link href="/vault" role="menuitem" onClick={() => setAccountOpen(false)}>
                  Vault
                </Link>
              </div>
            ) : null}
          </div>
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
        <div className="drawer drawer--luxury">
          <nav className="drawer__nav" aria-label="Mobile">
            {SITE_NAV.map((group) => {
              const hasChildren = Boolean(group.children?.length);
              if (!hasChildren) {
                return (
                  <Link key={`m-${group.id}`} href={group.href || "/"} onClick={() => setMenuOpen(false)}>
                    {group.label}
                  </Link>
                );
              }

              const expanded = drawerGroup === group.id;
              const isShop = group.id === "shop";

              return (
                <div
                  key={`m-${group.id}`}
                  className={`drawer__group${expanded ? " is-open" : ""}${isShop ? " drawer__group--shop" : ""}`}
                >
                  <button
                    type="button"
                    className="drawer__trigger"
                    aria-expanded={expanded}
                    onClick={() => setDrawerGroup(expanded ? null : group.id)}
                  >
                    <span>{group.label}</span>
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                  {expanded ? (
                    <div className="drawer__mega">
                      {isShop ? (
                        <ShopMegaMenu onNavigate={() => setMenuOpen(false)} />
                      ) : (
                        <GroupMegaMenu
                          groupId={group.id}
                          links={group.children || []}
                          onNavigate={() => setMenuOpen(false)}
                        />
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
              Wishlist
            </Link>
            <Link href="/account" onClick={() => setMenuOpen(false)}>
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
          <button type="button" onClick={() => setSearchOpen(true)}>
            Search
          </button>
        )}
        <Link href="/account">{account ? "Vault" : "Account"}</Link>
      </nav>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
