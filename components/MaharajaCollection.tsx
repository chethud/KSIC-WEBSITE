"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { MAHARAJA_PRODUCTS } from "@/lib/maharaja-products";

export default function MaharajaCollection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.42, 340);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="maharaja" id="collection">
      <div className="maharaja__inner">
        <header className="maharaja__head">
          <div className="maharaja__intro">
            <p className="maharaja__eyebrow">Featured Collection</p>
            <h2 className="maharaja__title">The Maharaja Collection</h2>
            <p className="maharaja__lead">
              A curated expression of Mysuru&apos;s royal spirit.
            </p>
          </div>
          <div className="maharaja__controls">
            <Link href="/collection/royal-blue" className="maharaja__view-all">
              View All <span aria-hidden="true">→</span>
            </Link>
            <div className="maharaja__arrows">
              <button type="button" aria-label="Previous products" onClick={() => scrollBy(-1)}>
                ←
              </button>
              <button type="button" aria-label="Next products" onClick={() => scrollBy(1)}>
                →
              </button>
            </div>
          </div>
        </header>

        <div className="maharaja__track" ref={trackRef} tabIndex={0}>
          {MAHARAJA_PRODUCTS.map((p) => (
            <Link
              key={p.code}
              href={`/collection/${p.slug}`}
              className="maharaja__item"
              aria-label={`View ${p.name} — ${p.priceLabel}`}
            >
              <div className="maharaja__media">
                <Image src={p.image} alt={p.name} fill sizes="280px" className="is-a" />
                <Image src={p.hover} alt="" fill sizes="280px" className="is-b" aria-hidden />
              </div>
              <div className="maharaja__meta">
                <h3>{p.name}</h3>
                <p>{p.code}</p>
                <span>{p.priceLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
