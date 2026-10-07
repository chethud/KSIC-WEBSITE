"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MAHARAJA_PRODUCTS } from "@/lib/maharaja-products";
import { SAREES } from "@/lib/saree-catalog";
import { CARE_NOTES, JOURNAL } from "@/lib/journal";

type Hit = { href: string; group: string; title: string; meta: string };

function hitsFor(query: string): Hit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const match = (...parts: string[]) => parts.join(" ").toLowerCase().includes(q);
  const products: Hit[] = [
    ...SAREES.filter((item) => match(item.name, item.code, item.description, item.badge, item.details.zari, item.categories.join(" "))).map((item) => ({
      href: `/sarees/${item.id}`,
      group: "Products",
      title: item.name,
      meta: item.code,
    })),
    ...MAHARAJA_PRODUCTS.filter((item) => match(item.name, item.code, item.tagline, item.colorName, item.category)).map((item) => ({
      href: `/collection/${item.slug}`,
      group: "Products",
      title: item.name,
      meta: item.code,
    })),
  ];
  const collections: Hit[] = [
    { href: "/collections", group: "Collections", title: "Maharaja Collection", meta: "Heritage collection" },
    { href: "/sarees", group: "Collections", title: "All Sarees", meta: "Women's collection" },
    { href: "/sarees?category=bridal", group: "Collections", title: "Bridal", meta: "Occasion" },
    { href: "/sarees?category=temple", group: "Collections", title: "Ceremonial", meta: "Temple border" },
    { href: "/sarees?category=traditional", group: "Collections", title: "Festive", meta: "Traditional" },
    { href: "/sarees?category=pastel", group: "Collections", title: "Everyday luxury", meta: "Pastel" },
  ].filter((item) => match(item.title, item.meta));
  const stories: Hit[] = JOURNAL.filter((item) => match(item.title, item.category, item.summary)).map((item) => ({
    href: item.href,
    group: "Stories",
    title: item.title,
    meta: item.category,
  }));
  const guides: Hit[] = CARE_NOTES.filter((item) => match(item.title, item.body, "care silk")).map((item) => ({
    href: "/care",
    group: "Guides",
    title: item.title,
    meta: "Silk care",
  }));
  return [...products, ...collections, ...stories, ...guides].slice(0, 12);
}

export default function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => hitsFor(query), [query]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const groups = ["Products", "Collections", "Stories", "Guides"];

  return (
    <div className="search" role="presentation">
      <button type="button" className="search__shade" aria-label="Close search" onClick={onClose} />
      <div className="search__panel" role="dialog" aria-modal="true" aria-label="Search Mysore Silk">
        <label className="search__label">
          Search
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Saree, colour, design number, story"
          />
        </label>
        {query.trim().length < 2 ? (
          <p className="search__hint">Search products, collections, stories, and care guides.</p>
        ) : results.length === 0 ? (
          <p className="search__hint" role="status">Nothing in the house matches that.</p>
        ) : (
          groups.map((group) => {
            const items = results.filter((hit) => hit.group === group);
            if (!items.length) return null;
            return (
              <section key={group}>
                <p className="ux-kicker">{group}</p>
                <ul>
                  {items.map((hit) => (
                    <li key={`${hit.group}-${hit.href}-${hit.title}`}>
                      <Link href={hit.href} onClick={onClose}>
                        <strong>{hit.title}</strong>
                        <span>{hit.meta}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
