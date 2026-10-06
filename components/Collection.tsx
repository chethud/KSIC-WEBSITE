"use client";

import Image from "next/image";
import { useRef } from "react";

const products = [
  { name: "The Royal Blue", code: "MS-001", image: "/products/KSIC-007/product.jpg" },
  { name: "The Vermilion", code: "MS-002", image: "/collection-4.jpg" },
  { name: "The Mysore Ivory", code: "MS-003", image: "/products/KSIC-003/product.jpg" },
  { name: "The Palace Green", code: "MS-004", image: "/products/KSIC-002/product.jpg" },
  { name: "The Maharani", code: "MS-005", image: "/products/KSIC-005/product.jpg" },
];

export default function Collection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0 });

  const scrollBy = (delta: number) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    carouselRef.current?.scrollBy({
      left: delta,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section className="collection" id="collection">
      <header className="collection__head">
        <div>
          <p className="eyebrow">Featured Collection</p>
          <h2 className="display">The Maharaja Collection</h2>
        </div>
        <div className="collection__controls">
          <a className="btn btn--text" href="#collection">
            View All <span aria-hidden="true">→</span>
          </a>
          <div className="carousel-nav">
            <button
              type="button"
              className="icon-btn"
              aria-label="Previous"
              onClick={() => scrollBy(-260)}
            >
              ←
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Next"
              onClick={() => scrollBy(260)}
            >
              →
            </button>
          </div>
        </div>
      </header>

      <div
        className="carousel"
        ref={carouselRef}
        onPointerDown={(e) => {
          const el = carouselRef.current;
          if (!el) return;
          drag.current = {
            down: true,
            startX: e.pageX - el.offsetLeft,
            scrollLeft: el.scrollLeft,
          };
          el.classList.add("is-dragging");
        }}
        onPointerUp={() => {
          drag.current.down = false;
          carouselRef.current?.classList.remove("is-dragging");
        }}
        onPointerLeave={() => {
          drag.current.down = false;
          carouselRef.current?.classList.remove("is-dragging");
        }}
        onPointerMove={(e) => {
          if (!drag.current.down || !carouselRef.current) return;
          const x = e.pageX - carouselRef.current.offsetLeft;
          carouselRef.current.scrollLeft =
            drag.current.scrollLeft - (x - drag.current.startX);
        }}
      >
        {products.map((product) => (
          <article className="product" key={product.code}>
            <div className="product__media">
              <div className="media-fill">
                <Image src={product.image} alt={product.name} fill sizes="230px" />
              </div>
            </div>
            <div className="product__meta">
              <h3>{product.name}</h3>
              <p>{product.code}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
