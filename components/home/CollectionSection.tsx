"use client";

import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Wadiyar Red",
    meta: "Pure Mysore Silk",
    price: "₹ 1,96,000",
    image: "/hero-campaign.jpg",
    hover: "/zari-macro.jpg",
    large: true,
  },
  {
    name: "Royal Blue",
    meta: "Maharaja Collection",
    price: "₹ 1,28,000",
    image: "/prod-blue.jpg",
    hover: "/gold-thread.jpg",
  },
  {
    name: "Palace Green",
    meta: "Pure Mysore Silk",
    price: "₹ 1,12,000",
    image: "/heritage-palace.jpg",
    hover: "/silk-threads.jpg",
  },
  {
    name: "The Maharani",
    meta: "Signature",
    price: "₹ 1,84,000",
    image: "/collection-1.jpg",
    hover: "/indian-saree-1.jpg",
    wide: true,
  },
];

export default function CollectionSection() {
  return (
    <section className="collection-ed" id="collection">
      <header className="section-head">
        <div>
          <p className="eyebrow">Curated</p>
          <h2 className="display">The Collection</h2>
          <p className="section-lead">Mysore silk, reimagined for today.</p>
        </div>
        <Link href="/your-saree" className="btn btn--text">
          View All <span aria-hidden="true">→</span>
        </Link>
      </header>

      <div className="collection-ed__grid">
        {products.map((p) => (
          <article
            key={p.name}
            className={`ed-product${p.large ? " ed-product--large" : ""}${p.wide ? " ed-product--wide" : ""}`}
          >
            <div className="ed-product__media">
              <Image src={p.image} alt={p.name} fill sizes="50vw" className="is-a" />
              <Image src={p.hover} alt="" fill sizes="50vw" className="is-b" aria-hidden />
              <button type="button" className="ed-product__wish" aria-label="Wishlist">
                ♡
              </button>
            </div>
            <div className="ed-product__meta">
              <h3>{p.name}</h3>
              <p>{p.meta}</p>
              <p className="price">{p.price}</p>
              <a href="#collection" className="btn btn--text">
                View Details <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
