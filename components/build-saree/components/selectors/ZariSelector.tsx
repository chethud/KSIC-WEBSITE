"use client";

import Image from "next/image";
import { ZARIS } from "../../data/catalog";
import { useCustomizerStore } from "../../store/customizerStore";

export function ZariSelector() {
  const zari = useCustomizerStore((s) => s.zari);
  const update = useCustomizerStore((s) => s.update);
  const setHoverRegion = useCustomizerStore((s) => s.setHoverRegion);
  const setCameraView = useCustomizerStore((s) => s.setCameraView);

  return (
    <div className="selector-block zari-step">
      <h2 className="step-title">Choose Your Zari</h2>
      <p className="step-sub">
        Select the metallic thread that brings your saree to life. Each zari type has its own unique shine, texture and heritage.
      </p>

      <div className="zari-grid" role="listbox" aria-label="Zari finishes">
        {ZARIS.map((z) => {
          const selected = zari === z.id;
          return (
            <button
              key={z.id}
              type="button"
              role="option"
              aria-selected={selected}
              className={`zari-card${selected ? " is-selected" : ""}`}
              onClick={() => {
                update({ zari: z.id });
                setCameraView("detail");
              }}
              onMouseEnter={() => setHoverRegion("zari")}
              onMouseLeave={() => setHoverRegion("none")}
            >
              <span className="zari-card-media">
                {z.fabricImage ? (
                  <Image
                    src={z.fabricImage}
                    alt=""
                    fill
                    sizes="160px"
                    className="zari-card-img"
                  />
                ) : (
                  <span className="zari-card-fallback" style={{ background: z.hex }} />
                )}
                {selected && (
                  <span className="zari-card-check" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12.5 10 17l9-10" />
                    </svg>
                  </span>
                )}
              </span>
              <span className="zari-card-meta">
                <strong>{z.name}</strong>
                <em>{z.description}</em>
              </span>
            </button>
          );
        })}
      </div>

      <aside className="zari-craft" aria-label="Authentic zari craftsmanship">
        <div className="zari-craft-media">
          <Image
            src="/models/zari/craft.jpg?v=1"
            alt=""
            fill
            sizes="96px"
            className="zari-craft-img"
          />
        </div>
        <div className="zari-craft-mark" aria-hidden>
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1" />
            <path
              d="M20 8.5c-1.6 5.2-1.6 8.6 0 11.5 1.6-2.9 1.6-6.3 0-11.5zM20 31.5c-1.6-5.2-1.6-8.6 0-11.5 1.6 2.9 1.6 6.3 0 11.5zM8.5 20c5.2-1.6 8.6-1.6 11.5 0-2.9 1.6-6.3 1.6-11.5 0zM31.5 20c-5.2-1.6-8.6-1.6-11.5 0 2.9 1.6 6.3 1.6 11.5 0z"
              fill="currentColor"
              opacity="0.85"
            />
            <circle cx="20" cy="20" r="2.4" fill="currentColor" />
          </svg>
        </div>
        <div className="zari-craft-copy">
          <p className="zari-craft-title">Authentic Zari Craftsmanship</p>
          <p className="zari-craft-body">
            Real metallic threads, woven by skilled artisans of Mysore.
          </p>
        </div>
      </aside>
    </div>
  );
}
