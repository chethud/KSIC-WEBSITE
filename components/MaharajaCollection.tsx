"use client";

import Image from "next/image";
import { useRef } from "react";

const products = [
  {
    name: "The Royal Blue",
    code: "MS-001",
    price: "₹ 1,28,000",
    image: "/prod-blue.jpg",
    hover: "/collection-4.jpg",
  },
  {
    name: "The Vermilion",
    code: "MS-002",
    price: "₹ 1,42,000",
    image: "/fabric-red.jpg",
    hover: "/prod-vermilion.jpg",
  },
  {
    name: "The Mysore Ivory",
    code: "MS-003",
    price: "₹ 1,18,000",
    image: "/collection-3.jpg",
    hover: "/heirloom.jpg",
  },
  {
    name: "The Palace Green",
    code: "MS-004",
    price: "₹ 1,36,000",
    image: "/heritage-palace.jpg",
    hover: "/silk-threads.jpg",
  },
  {
    name: "The Maharani",
    code: "MS-005",
    price: "₹ 1,84,000",
    image: "/collection-1.jpg",
    hover: "/indian-saree-1.jpg",
  },
];

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
      <header className="maharaja__head">
        <div>
          <p className="eyebrow">Featured Collection</p>
          <h2 className="display">
            The Maharaja
            <br />
            Collection
          </h2>
          <p className="maharaja__lead">A curated expression of Mysuru&apos;s royal spirit.</p>
        </div>
        <div className="maharaja__controls">
          <a href="#collection" className="btn btn--text">
            View All <span aria-hidden="true">→</span>
          </a>
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
        {products.map((p) => (
          <article key={p.code} className="maharaja__item">
            <div className="maharaja__media">
              <Image src={p.image} alt={p.name} fill sizes="280px" className="is-a" />
              <Image src={p.hover} alt="" fill sizes="280px" className="is-b" aria-hidden />
            </div>
            <div className="maharaja__meta">
              <h3>{p.name}</h3>
              <p>{p.code}</p>
              <span>{p.price}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
