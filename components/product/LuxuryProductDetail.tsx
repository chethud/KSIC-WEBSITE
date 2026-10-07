"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addBagItem, parseInr } from "@/lib/bag";
import "./luxury-detail.css";

export type PdpCrumb = { href?: string; label: string };
export type PdpShot = { src: string; alt: string };
export type PdpColor = {
  id: string;
  label: string;
  hex: string;
  href?: string;
};
export type PdpAccordion = { id: string; title: string; body: string };
export type PdpRelated = { href: string; name: string; price: string; image: string };

type Props = {
  crumbs: PdpCrumb[];
  name: string;
  tagline: string;
  price: string;
  priceAmount?: number;
  productId?: string;
  productHref?: string;
  description: string;
  images: PdpShot[];
  colors: PdpColor[];
  activeColorId: string;
  onColor?: (id: string) => void;
  accordions: PdpAccordion[];
  related: PdpRelated[];
  rating?: { score: string; count: string };
};

export default function LuxuryProductDetail({
  crumbs,
  name,
  tagline,
  price,
  priceAmount,
  productId,
  productHref,
  description,
  images,
  colors,
  activeColorId,
  onColor,
  accordions,
  related,
  rating = { score: "4.8", count: "120 reviews" },
}: Props) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setIndex(0);
  }, [images[0]?.src, name]);

  const shot = images[index] ?? images[0];
  const count = images.length;

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2800);
  };

  const step = (dir: -1 | 1) => {
    if (!count) return;
    setIndex((current) => (current + dir + count) % count);
  };

  return (
    <div className="pdp">
      <nav className="pdp__crumb" aria-label="Breadcrumb">
        {crumbs.map((crumb, i) => (
          <span key={`${crumb.label}-${i}`} className="pdp__crumb-item">
            {i > 0 ? <span aria-hidden="true">›</span> : null}
            {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <em>{crumb.label}</em>}
          </span>
        ))}
      </nav>

      <div className="pdp__layout">
        <div className="pdp__gallery">
          <div className="pdp__thumbs" role="tablist" aria-label="Saree views">
            {images.map((image, i) => (
              <button
                key={`${image.src}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={i === index ? "is-active" : undefined}
                onClick={() => setIndex(i)}
              >
                <Image src={image.src} alt="" fill sizes="140px" />
              </button>
            ))}
          </div>

          <div className="pdp__stage">
            {shot ? (
              <Image
                key={shot.src + index}
                src={shot.src}
                alt={shot.alt}
                fill
                priority
                sizes="(max-width: 799px) 100vw, 52vw"
                className="pdp__stage-img"
              />
            ) : null}
            <div className="pdp__caption">
              <p>
                A saree
                <br />
                beyond time
              </p>
              <span />
            </div>
            <div className="pdp__nav">
              <button type="button" aria-label="Previous image" onClick={() => step(-1)}>
                ←
              </button>
              <button type="button" aria-label="Next image" onClick={() => step(1)}>
                →
              </button>
            </div>
          </div>
        </div>

        <aside className="pdp__info">
          <h1>{name}</h1>
          <p className="pdp__tagline">{tagline}</p>

          <div className="pdp__price-row">
            <div>
              <p className="pdp__price">{price}</p>
              <p className="pdp__tax">Inclusive of all taxes</p>
            </div>
            <p className="pdp__rating">
              <span aria-hidden="true">★★★★★</span>
              <strong>{rating.score}</strong>
              <em>({rating.count})</em>
            </p>
          </div>

          <p className="pdp__desc">{description}</p>
          <hr className="pdp__rule" />

          <p className="pdp__label">Colour</p>
          <div className="pdp__swatches" role="listbox" aria-label="Colour">
            {colors.map((color) => {
              const active = color.id === activeColorId;
              const className = active ? "is-active" : undefined;
              if (color.href && !active) {
                return (
                  <Link
                    key={color.id}
                    href={color.href}
                    className={className}
                    style={{ background: color.hex }}
                    aria-label={color.label}
                    title={color.label}
                  />
                );
              }
              return (
                <button
                  key={color.id}
                  type="button"
                  className={className}
                  style={{ background: color.hex }}
                  aria-label={color.label}
                  aria-pressed={active}
                  title={color.label}
                  onClick={() => onColor?.(color.id)}
                />
              );
            })}
          </div>

          <div className="pdp__buy">
            <button
              type="button"
              className="pdp__btn pdp__btn--gold"
              onClick={() => {
                const colour = colors.find((color) => color.id === activeColorId)?.label ?? "";
                addBagItem({
                  id: `${productId ?? name}-${activeColorId || "default"}`,
                  name,
                  detail: colour,
                  href: productHref ?? "/sarees",
                  image: images[0]?.src ?? "",
                  price: priceAmount ?? parseInr(price),
                });
                flash(`${name} added to your bag`);
              }}
            >
              <BagIcon />
              Add to Cart
            </button>
            <button type="button" className="pdp__btn pdp__btn--line" onClick={() => flash(`Checkout started for ${name}`)}>
              Buy Now
            </button>
          </div>
          {notice ? (
            <p className="pdp__notice" role="status">
              {notice}
            </p>
          ) : null}

          <ul className="pdp__benefits">
            <li>
              <TruckIcon />
              <span>
                Free Shipping
                <br />
                in India
              </span>
            </li>
            <li>
              <BoxIcon />
              <span>
                7 Day
                <br />
                Easy Returns
              </span>
            </li>
            <li>
              <SealIcon />
              <span>
                Certified
                <br />
                Pure Silk
              </span>
            </li>
            <li>
              <HeartIcon />
              <span>
                Handwoven
                <br />
                in Mysuru
              </span>
            </li>
          </ul>

          <div className="pdp__accordions">
            {accordions.map((row) => {
              const expanded = open === row.id;
              return (
                <div key={row.id} className={expanded ? "is-open" : undefined}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? null : row.id)}
                  >
                    <span>{row.title}</span>
                    <i aria-hidden="true">{expanded ? "–" : "+"}</i>
                  </button>
                  {expanded ? <p>{row.body}</p> : null}
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="pdp__also" aria-label="You may also like">
          <h2>You may also like</h2>
          <div className="pdp__also-grid">
            {related.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className="pdp__also-media">
                  <Image src={item.image} alt="" fill sizes="280px" />
                </span>
                <span className="pdp__also-name">{item.name}</span>
                <span className="pdp__also-price">{item.price}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 8h11l-.8 11H7.3L6.5 8Z" />
      <path d="M9 8V6.8a3 3 0 0 1 6 0V8" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7" />
      <circle cx="7" cy="17.5" r="1.4" />
      <circle cx="17" cy="17.5" r="1.4" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8l8-4 8 4-8 4-8-4Z" />
      <path d="M4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}
function SealIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <path d="M8.5 12.2l2.2 2.2 4.8-5" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19s-6.2-3.8-6.2-8A3.4 3.4 0 0 1 12 8.2 3.4 3.4 0 0 1 18.2 11C18.2 15.2 12 19 12 19Z" />
    </svg>
  );
}
