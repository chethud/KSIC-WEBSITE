"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SAREES, type SareeCategory } from "@/lib/saree-catalog";
import { beginIntent } from "@/lib/intent";
import { isWished, removeWish } from "@/lib/wishlist";
import "./saree-collection.css";

type Category = SareeCategory;
type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All Sarees" },
  { id: "pure-silk", label: "Pure Silk" },
  { id: "zari", label: "Zari Work" },
  { id: "temple", label: "Temple Border" },
  { id: "pastel", label: "Pastel" },
  { id: "bridal", label: "Bridal" },
  { id: "traditional", label: "Traditional" },
  { id: "contemporary", label: "Contemporary" },
];


const VISIBLE_SWATCHES = 4;

function formatPrice(value: number) {
  return `₹ ${value.toLocaleString("en-IN")}`;
}

export default function SareeCollection() {
  const params = useSearchParams();
  const requested = params.get("category");
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [colorById, setColorById] = useState<Record<string, string>>({});

  useEffect(() => {
    if (requested && CATEGORIES.some((cat) => cat.id === requested)) {
      setCategory(requested as Category);
    }
  }, [requested]);

  useEffect(() => {
    const next: Record<string, boolean> = {};
    SAREES.forEach((saree) => {
      if (isWished(saree.id)) next[saree.id] = true;
    });
    setSaved(next);
  }, []);

  const items = useMemo(() => {
    const filtered =
      category === "all"
        ? SAREES
        : SAREES.filter((s) =>
            s.categories.includes(category as Exclude<Category, "all">)
          );
    const next = [...filtered];
    if (sort === "price-asc") next.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") next.sort((a, b) => b.price - a.price);
    else if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));
    else next.sort((a, b) => a.featured - b.featured);
    return next;
  }, [category, sort]);

  return (
    <section className="saree-col" aria-label="Women's saree collection">
      <div className="saree-col__hero">
        <Image
          src="/sarees/hero.jpg"
          alt="Woman in a Mysore silk saree at golden hour before palace architecture"
          fill
          priority
          sizes="100vw"
          className="saree-col__hero-img"
        />
        <div className="saree-col__hero-shade" aria-hidden="true" />
        <div className="saree-col__hero-copy">
          <p className="saree-col__eyebrow">Women&apos;s Collection</p>
          <h1>Sarees Beyond Time</h1>
          <p className="saree-col__lede">
            Handwoven elegance from Mysuru, crafted for every story.
          </p>
        </div>
      </div>

      <div className="saree-col__toolbar">
        <div className="saree-col__filters" role="tablist" aria-label="Saree categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={category === cat.id}
              className={category === cat.id ? "is-active" : undefined}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="saree-col__controls">
          <label className="saree-col__sort">
            <span>Sort by</span>
            <select
              value={sort}
              aria-label="Sort sarees"
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price · Low to high</option>
              <option value="price-desc">Price · High to low</option>
              <option value="name">Name</option>
            </select>
          </label>
          <div className="saree-col__views" role="group" aria-label="Layout">
            <button
              type="button"
              className={view === "grid" ? "is-active" : undefined}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="1" y="1" width="6" height="6" />
                <rect x="9" y="1" width="6" height="6" />
                <rect x="1" y="9" width="6" height="6" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </button>
            <button
              type="button"
              className={view === "list" ? "is-active" : undefined}
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="1" y="2" width="14" height="2.2" />
                <rect x="1" y="7" width="14" height="2.2" />
                <rect x="1" y="12" width="14" height="2.2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="saree-col__empty">No sarees in this edit just yet.</p>
      ) : (
        <ul className={`saree-col__grid${view === "list" ? " is-list" : ""}`}>
          {items.map((saree) => {
            const activeSwatchId = colorById[saree.id] ?? saree.swatches[0].id;
            const activeSwatch =
              saree.swatches.find((sw) => sw.id === activeSwatchId) ?? saree.swatches[0];
            const photo = activeSwatch.image ?? saree.image;
            const visible = saree.swatches.slice(0, VISIBLE_SWATCHES);
            const extra = saree.swatches.length - visible.length;
            const liked = Boolean(saved[saree.id]);

            return (
              <li key={saree.id}>
                <article className="saree-card">
                  <div className="saree-card__visual">
                    <Link
                      href={`/sarees/${saree.id}`}
                      className="saree-card__photo"
                      aria-label={`View details for ${saree.name}`}
                    >
                      <Image
                        key={photo}
                        src={photo}
                        alt={saree.name}
                        fill
                        sizes="(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 33vw"
                        className="saree-card__img"
                      />
                    </Link>
                    <span className="saree-card__badge">{saree.badge}</span>
                    <button
                      type="button"
                      className={`saree-card__heart${liked ? " is-saved" : ""}`}
                      aria-pressed={liked}
                      aria-label={liked ? `Remove ${saree.name} from saved` : `Save ${saree.name}`}
                      onClick={() => {
                        if (liked) {
                          removeWish(saree.id);
                          setSaved((prev) => ({ ...prev, [saree.id]: false }));
                          return;
                        }
                        const ran = beginIntent({
                          type: "wishlist",
                          next: "/wishlist",
                          item: {
                            id: saree.id,
                            name: saree.name,
                            href: `/sarees/${saree.id}`,
                            image: photo,
                            price: saree.price,
                            code: saree.code,
                          },
                        });
                        if (ran) setSaved((prev) => ({ ...prev, [saree.id]: true }));
                      }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20Z" />
                      </svg>
                    </button>
                    <span className="saree-card__fabric">
                      <Image src={saree.fabric} alt="" fill sizes="110px" />
                    </span>
                  </div>

                  <div className="saree-card__info">
                    <h2>{saree.name}</h2>
                    <p>{saree.code}</p>
                    <p>{saree.description}</p>
                    <p className="saree-card__price">{formatPrice(saree.price)}</p>
                    <div className="saree-card__swatches" role="listbox" aria-label={`${saree.name} colours`}>
                      {visible.map((sw) => (
                        <button
                          key={sw.id}
                          type="button"
                          role="option"
                          aria-selected={sw.id === activeSwatchId}
                          aria-label={sw.label}
                          title={sw.label}
                          className={sw.id === activeSwatchId ? "is-active" : undefined}
                          style={{ background: sw.hex }}
                          onClick={() =>
                            setColorById((prev) => ({ ...prev, [saree.id]: sw.id }))
                          }
                        />
                      ))}
                      {extra > 0 ? <span className="saree-card__more">+{extra}</span> : null}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
