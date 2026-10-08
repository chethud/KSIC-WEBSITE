"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GROUP_MEGA, type NavLeaf } from "@/lib/site-nav";

type GroupMegaMenuProps = {
  groupId: string;
  links: readonly NavLeaf[];
  onNavigate?: () => void;
};

function splitTitle(title: string) {
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 1) return { lead: "", end: title };
  return {
    lead: parts.slice(0, -1).join(" "),
    end: parts[parts.length - 1],
  };
}

export default function GroupMegaMenu({ groupId, links, onNavigate }: GroupMegaMenuProps) {
  const intro = GROUP_MEGA[groupId];
  const [activeHref, setActiveHref] = useState<string | null>(null);

  if (!intro) return null;

  const active = links.find((item) => item.href === activeHref) ?? null;

  const panel = active
    ? {
        label: intro.label,
        title: active.label,
        ctaLabel: active.ctaLabel || "Explore",
        ctaHref: active.href,
        image: active.image,
      }
    : {
        label: intro.label,
        title: intro.title,
        ctaLabel: intro.ctaLabel,
        ctaHref: intro.ctaHref,
        image: undefined as string | undefined,
      };

  const { lead, end } = splitTitle(panel.title);

  return (
    <div
      className="group-mega"
      role="region"
      aria-label={`${intro.label} menu`}
      onMouseLeave={() => setActiveHref(null)}
    >
      <div
        className={`group-mega__intro shop-mega__col--intro${active ? " is-detail" : ""}`}
        key={panel.ctaHref}
      >
        {active && panel.image ? (
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
      </div>

      <ul className="group-mega__links shop-mega__cats">
        {links.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                className={`shop-mega__cat${isActive ? " is-active" : ""}`}
                onMouseEnter={() => setActiveHref(item.href)}
                onFocus={() => setActiveHref(item.href)}
                onClick={onNavigate}
              >
                <span className="shop-mega__thumb">
                  {item.image ? (
                    <Image src={item.image} alt="" width={48} height={48} />
                  ) : null}
                </span>
                <span className="shop-mega__cat-name">{item.label}</span>
                <span className="shop-mega__arrow" aria-hidden="true">›</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
