"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { COLOUR_CATEGORIES, COLORS } from "../../data/catalog";
import { useCustomizerStore } from "../../store/customizerStore";
import type { ColourCategory } from "../../types/customization";

const LIGHTING = [
  { id: "daylight", label: "Daylight" },
  { id: "warm", label: "Warm Indoor" },
  { id: "golden", label: "Golden Hour" },
  { id: "evening", label: "Evening" },
] as const;

export function ColorSelector() {
  const color = useCustomizerStore((s) => s.color);
  const update = useCustomizerStore((s) => s.update);
  const [category, setCategory] = useState<ColourCategory>("all");
  const [viewOnModel, setViewOnModel] = useState(true);
  const [lightingOpen, setLightingOpen] = useState(false);
  const [lighting, setLighting] = useState<(typeof LIGHTING)[number]["id"]>("daylight");

  const selected = color ? COLORS.find((c) => c.id === color) : null;

  const filtered = useMemo(() => {
    if (category === "all") return COLORS;
    return COLORS.filter((c) => c.category === category);
  }, [category]);

  return (
    <div className="selector-block colour-step">
      <div className="step-header-row">
        <div>
          <h2 className="step-title">Choose Your Colour</h2>
          <p className="step-sub">
            Select a base colour for your saree.
            <br />
            See the look change in real time.
          </p>
        </div>
        <label className="view-toggle">
          <span>View on model</span>
          <button
            type="button"
            role="switch"
            className={`ios-switch${viewOnModel ? " is-on" : ""}`}
            aria-checked={viewOnModel}
            onClick={() => setViewOnModel((v) => !v)}
          >
            <span className="ios-switch-knob" />
          </button>
        </label>
      </div>

      <div className="category-pills" role="tablist" aria-label="Colour families">
        {COLOUR_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={category === c.id}
            className={`category-pill${category === c.id ? " is-active" : ""}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={`silk-grid${viewOnModel ? "" : " is-fabric-only"}`}>
        {filtered.length === 0 ? (
          <p className="silk-empty">More tones arriving soon in this family.</p>
        ) : (
          filtered.map((c) => {
            const isSelected = color === c.id;
            return (
              <button
                key={c.id}
                type="button"
                className={`silk-swatch${isSelected ? " is-selected" : ""}`}
                aria-pressed={isSelected}
                aria-label={`${c.name}${c.tone ? `, ${c.tone}` : ""}`}
                onClick={() => update({ color: c.id, colorMode: "single" })}
              >
                <span className="silk-swatch-fabric">
                  {c.fabricImage ? (
                    <Image
                      src={c.fabricImage}
                      alt=""
                      fill
                      sizes="(max-width: 639px) 118px, 140px"
                      className="silk-swatch-img"
                    />
                  ) : (
                    <span className="silk-swatch-fallback" style={{ background: c.hex }} />
                  )}
                  {isSelected && (
                    <span className="silk-check" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M5 12.5 10 17l9-10" />
                      </svg>
                    </span>
                  )}
                </span>
                <span className="silk-swatch-meta">
                  <strong>{c.name}</strong>
                  <em>{c.tone}</em>
                </span>
              </button>
            );
          })
        )}
      </div>

      {selected && (
        <div className="fabric-detail">
          <div className="fabric-detail-preview">
            {selected.fabricImage ? (
              <Image
                src={selected.fabricImage}
                alt={`${selected.name} silk`}
                fill
                sizes="140px"
                className="fabric-detail-img"
              />
            ) : (
              <span className="silk-swatch-fallback" style={{ background: selected.hex }} />
            )}
          </div>
          <div className="fabric-detail-copy">
            <div className="fabric-detail-title">
              <h3>{selected.name}</h3>
              {selected.popular && <span className="fabric-badge">Popular</span>}
            </div>
            <p>{selected.description}</p>
            <div className="lighting-wrap">
              <button
                type="button"
                className="lighting-btn"
                aria-expanded={lightingOpen}
                onClick={() => setLightingOpen((o) => !o)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <circle cx="12" cy="12" r="3.5" />
                  <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
                </svg>
                View in different lights
              </button>
              {lightingOpen && (
                <div className="lighting-popover" role="listbox" aria-label="Lighting presets">
                  {LIGHTING.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={lighting === opt.id}
                      className={lighting === opt.id ? "is-active" : undefined}
                      onClick={() => {
                        setLighting(opt.id);
                        setLightingOpen(false);
                        document.documentElement.dataset.atelierLight = opt.id;
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
