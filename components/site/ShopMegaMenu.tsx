"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SHOP_MEGA } from "@/lib/site-nav";

type ShopMegaMenuProps = {
  onNavigate?: () => void;
};

function PalaceSketch() {
  return (
    <svg
      className="shop-mega__palace"
      viewBox="0 0 240 90"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 78h216M28 78V52l20-14 20 14v26M72 78V40l20-16 20 16v38M112 78V28l28-18 28 18v50M172 78V52l20-14 20 14v26"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M48 38v-8M112 22v-10M132 10v-6M152 22v-10M192 38v-8"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="132" cy="2" r="1.5" fill="currentColor" />
    </svg>
  );
}

function splitTitle(title: string) {
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 1) return { lead: "", end: title };
  return {
    lead: parts.slice(0, -1).join(" "),
    end: parts[parts.length - 1],
  };
}

export default function ShopMegaMenu({ onNavigate }: ShopMegaMenuProps) {
  const { intro, featured } = SHOP_MEGA;
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const active = featured.find((item) => item.href === activeHref) ?? null;

  const panel = active
    ? {
        label: "Featured",
        title: active.label,
        ctaLabel: active.ctaLabel || "View collection",
        ctaHref: active.href,
        image: active.image,
      }
    : {
        label: intro.label,
        title: intro.title,
        ctaLabel: intro.ctaLabel,
        ctaHref: intro.ctaHref,
        image: intro.image,
      };

  const { lead, end } = splitTitle(panel.title);

  return (
    <div
      className="shop-mega"
      role="region"
      aria-label="Shop menu"
      onMouseLeave={() => setActiveHref(null)}
    >
      <div
        className={`shop-mega__col shop-mega__col--intro${active ? " is-detail" : ""}`}
        key={panel.ctaHref}
      >
        {active ? (
          <div className="shop-mega__preview">
            <Image
              src={panel.image}
              alt=""
              fill
              sizes="320px"
              className="shop-mega__preview-img"
            />
          </div>
        ) : null}
        <p className="shop-mega__label">{panel.label}</p>
        <h3 className="shop-mega__title">
          {lead ? (
            <>
              <span>{lead}</span>
              <span>{end}</span>
            </>
          ) : (
            <span>{panel.title}</span>
          )}
        </h3>
        <div className="shop-mega__rule" aria-hidden="true" />
        <Link href={panel.ctaHref} className="shop-mega__cta" onClick={onNavigate}>
          {panel.ctaLabel} <span aria-hidden="true">→</span>
        </Link>
        {!active ? <PalaceSketch /> : null}
      </div>

      <div className="shop-mega__col shop-mega__col--featured">
        <p className="shop-mega__label">Featured</p>
        <ul className="shop-mega__cats">
          {featured.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`shop-mega__cat${isActive ? " is-active" : ""}`}
                  onMouseEnter={() => setActiveHref(item.href)}
                  onFocus={() => setActiveHref(item.href)}
                  onClick={onNavigate}
                >
                  <span className="shop-mega__thumb">
                    <Image src={item.image} alt="" width={48} height={48} />
                  </span>
                  <span className="shop-mega__cat-name">{item.label}</span>
                  <span className="shop-mega__arrow" aria-hidden="true">›</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
