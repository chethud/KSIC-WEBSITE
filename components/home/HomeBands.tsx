"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const studioViews = [
  { id: "front", label: "Front", src: "/studio/views/front.jpg?v=2" },
  { id: "three", label: "Three-quarter", src: "/studio/views/three.jpg?v=2" },
  { id: "side", label: "Side", src: "/studio/views/side.jpg?v=2" },
  { id: "back", label: "Back", src: "/studio/views/back.jpg?v=2" },
] as const;

export function StudioBand() {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const dragX = useRef<number | null>(null);
  const view = studioViews[index];

  const step = (dir: -1 | 1) => {
    setIndex((current) => (current + dir + studioViews.length) % studioViews.length);
  };

  return (
    <section className="studio-exp" aria-label="3D silk studio">
      <div className="studio-exp__board">
      <div
        className="studio-exp__viewer"
        onPointerDown={(event) => {
          dragX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (dragX.current == null) return;
          const delta = event.clientX - dragX.current;
          dragX.current = null;
          if (delta > 48) step(-1);
          else if (delta < -48) step(1);
        }}
      >
        <div className="studio-exp__thumbs" role="tablist" aria-label="Camera angle">
          {studioViews.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              aria-label={item.label}
              className={itemIndex === index ? "is-active" : undefined}
              onClick={() => setIndex(itemIndex)}
            >
              <Image src={item.src} alt="" width={72} height={96} />
            </button>
          ))}
        </div>

        <div className={`studio-exp__stage${zoomed ? " is-zoomed" : ""}`}>
          {studioViews.map((item, itemIndex) => (
            <Image
              key={item.id}
              src={item.src}
              alt={itemIndex === index ? `Emerald Mysore silk, ${item.label.toLowerCase()} view` : ""}
              aria-hidden={itemIndex !== index}
              fill
              sizes="(max-width: 899px) 100vw, 55vw"
              priority={itemIndex === 0}
              className={itemIndex === index ? "is-active" : undefined}
            />
          ))}
        </div>

        <div className="studio-exp__controls">
          <button type="button" onClick={() => step(1)} aria-label="Rotate the view">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.3-5.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M20 4.5V9h-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            360°
          </button>
          <button type="button" aria-pressed={zoomed} onClick={() => setZoomed((value) => !value)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M15.2 15.2 19 19" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Zoom
          </button>
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h16M7 9 4 12l3 3M17 9l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Drag to turn
          </span>
        </div>
      </div>

      <div className="studio-exp__copy">
        <p className="studio-exp__kicker">Experience</p>
        <h2>
          <span>See it. Feel it.</span>
          <span>In 3D.</span>
        </h2>
        <p>
          Explore how the saree looks on you — from every angle. Zoom, rotate, and experience the true beauty of Mysore silk.
        </p>
        <Link href="/your-saree" className="studio-exp__cta">
          Try 3D studio <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="studio-exp__phone" aria-hidden="true">
        <div className="studio-exp__phone-screen">
          <Image src={view.src} alt="" fill sizes="230px" />
          <div className="studio-exp__phone-thumbs">
            {studioViews.map((item, itemIndex) => (
              <span key={item.id} className={itemIndex === index ? "is-active" : undefined}>
                <Image src={item.src} alt="" width={28} height={38} />
              </span>
            ))}
          </div>
          <span className="studio-exp__phone-hint">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.3-5.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M20 4.5V9h-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
        </div>
      </div>
      </div>
    </section>
  );
}

const closeGates = [
  {
    href: "/journal",
    kicker: "Journal",
    title: "Read the loom's story",
    copy: "Heritage chapters, read on their own. A story never drops a saree into the bag.",
    cta: "Read story",
    image: "/journal/journal-loom.jpg?v=2",
    alt: "An artisan weaving maroon Mysore silk with gold zari",
  },
  {
    href: "/wear",
    kicker: "How to wear",
    title: "Learn the art of the saree",
    copy: "The house drape, the length on the loom ticket, and what the studio can show.",
    cta: "Read the guide",
    image: "/journal/journal-wear.jpg",
    alt: "A woman in an ivory Mysore silk saree with a gold zari border",
  },
  {
    href: "/account",
    kicker: "Silk Vault",
    title: "Where a saree lives after you buy it",
    copy: "Wishlist, saved creations, and — once an order can be completed — your wardrobe.",
    cta: "Open my wardrobe",
    image: "/journal/journal-vault.jpg",
    alt: "A rosewood chest of folded Mysore silk sarees",
  },
] as const;

export function CloseBand() {
  return (
    <section className="home-band" aria-label="Journal, how to wear, and Silk Vault">
      <div className="home-band__inner">
        {closeGates.map((gate) => (
          <Link key={gate.href} href={gate.href} className="home-gate">
            <div className="home-gate__media">
              <Image src={gate.image} alt={gate.alt} fill sizes="(max-width: 799px) 100vw, 33vw" />
            </div>
            <div className="home-gate__copy">
              <em>{gate.kicker}</em>
              <strong>{gate.title}</strong>
              <p>{gate.copy}</p>
              <span>
                {gate.cta}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
