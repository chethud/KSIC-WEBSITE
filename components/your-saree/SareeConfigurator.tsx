"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BASE_PRICE,
  BORDERS,
  BORDER_WIDTHS,
  COLOURS,
  MOTIFS,
  MOTIF_DENSITIES,
  MOTIF_PLACEMENTS,
  MOTIF_SIZES,
  PALLUS,
  STEPS,
  WEAVES,
  ZARIS,
  createDesignId,
  formatINR,
  type LightMode,
  type StepId,
  type ToneMode,
  type ViewMode,
} from "@/lib/saree-config";

const VIEW_ZOOM: Record<ViewMode, number> = {
  full: 1,
  upper: 1.35,
  border: 1.7,
  pallu: 1.55,
  fabric: 2,
};

const LIGHT_FILTER: Record<LightMode, string> = {
  natural: "contrast(1.05) saturate(1.05)",
  warm: "sepia(0.22) saturate(1.15) brightness(1.05)",
  cool: "saturate(0.95) brightness(1.08) hue-rotate(8deg)",
  indoor: "contrast(1.1) brightness(0.92) saturate(1.08)",
  evening: "sepia(0.35) brightness(0.85) contrast(1.12)",
};

export default function SareeConfigurator() {
  const [step, setStep] = useState<StepId>("colour");
  const [maxReached, setMaxReached] = useState(0);
  const [toneMode, setToneMode] = useState<ToneMode>("single");
  const [colourId, setColourId] = useState("maroon");
  const [secondaryId, setSecondaryId] = useState("ivory");
  const [weaveId, setWeaveId] = useState("classic");
  const [zariId, setZariId] = useState("gold");
  const [borderId, setBorderId] = useState("temple");
  const [borderWidth, setBorderWidth] = useState<(typeof BORDER_WIDTHS)[number]>("Medium");
  const [palluId, setPalluId] = useState("classic");
  const [motifId, setMotifId] = useState("peacock");
  const [motifSize, setMotifSize] = useState<(typeof MOTIF_SIZES)[number]>("Medium");
  const [motifDensity, setMotifDensity] = useState<(typeof MOTIF_DENSITIES)[number]>("Balanced");
  const [motifPlacement, setMotifPlacement] = useState<(typeof MOTIF_PLACEMENTS)[number]>("All Over");
  const [view, setView] = useState<ViewMode>("full");
  const [zoom, setZoom] = useState(100);
  const [light, setLight] = useState<LightMode>("natural");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [modal, setModal] = useState<"save" | "share" | "cart" | null>(null);
  const [designId, setDesignId] = useState(createDesignId());

  const colour = COLOURS.find((c) => c.id === colourId) ?? COLOURS[0];
  const secondary = COLOURS.find((c) => c.id === secondaryId) ?? COLOURS[10];
  const weave = WEAVES.find((w) => w.id === weaveId) ?? WEAVES[0];
  const zari = ZARIS.find((z) => z.id === zariId) ?? ZARIS[0];
  const border = BORDERS.find((b) => b.id === borderId) ?? BORDERS[2];
  const pallu = PALLUS.find((p) => p.id === palluId) ?? PALLUS[0];
  const motif = MOTIFS.find((m) => m.id === motifId) ?? MOTIFS[3];

  const widthPrice =
    borderWidth === "Small" ? 0 : borderWidth === "Medium" ? 3000 : borderWidth === "Wide" ? 7000 : 12000;
  const motifExtra =
    (motifSize === "Large" ? 4000 : motifSize === "Medium" ? 2000 : 0) +
    (motifDensity === "Rich" ? 5000 : motifDensity === "Balanced" ? 2000 : 0);

  const breakdown = useMemo(
    () => [
      { label: "Base Silk", value: BASE_PRICE },
      { label: "Colour", value: colour.price + (toneMode === "dual" || toneMode === "contrast" ? 8000 : 0) },
      { label: "Weave", value: weave.price },
      { label: "Zari", value: zari.price },
      { label: "Border", value: border.price + widthPrice },
      { label: "Pallu", value: pallu.price },
      { label: "Motifs", value: motif.price + motifExtra },
    ],
    [colour.price, toneMode, weave.price, zari.price, border.price, widthPrice, pallu.price, motif.price, motifExtra]
  );

  const total = breakdown.reduce((sum, row) => sum + row.value, 0);

  const goStep = (id: StepId) => {
    const index = STEPS.findIndex((s) => s.id === id);
    if (index <= maxReached || index === maxReached + 1 || index === 0) {
      setStep(id);
      setMaxReached((m) => Math.max(m, index));
    }
  };

  const nextStep = () => {
    const index = STEPS.findIndex((s) => s.id === step);
    if (index < STEPS.length - 1) {
      const next = STEPS[index + 1].id;
      setMaxReached((m) => Math.max(m, index + 1));
      setStep(next);
    }
  };

  const scale = (VIEW_ZOOM[view] * zoom) / 100;

  const previewFilter = `${colour.filter} ${LIGHT_FILTER[light]}`;

  return (
    <div className="ys">
      <div className="ys__intro">
        <p className="eyebrow eyebrow--light" style={{ marginBottom: "0.6rem" }}>
          Your Saree
        </p>
        <h1>Craft Your Own</h1>
        <p>A saree as unique as you.</p>
      </div>

      <div className="ys__shell">
        <aside className="ys__journey">
          <p className="ys__journey-title">Your Saree</p>
          <p className="ys__journey-sub">Craft Your Own</p>
          <div className="ys__steps">
            {STEPS.map((s, i) => {
              const active = s.id === step;
              const done = i < maxReached || (i === maxReached && s.id !== step && i !== STEPS.findIndex((x) => x.id === step));
              const unlocked = i <= maxReached;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`ys__step${active ? " is-active" : ""}${done || (unlocked && !active) ? " is-done" : ""}`}
                  onClick={() => unlocked && goStep(s.id)}
                  disabled={!unlocked}
                >
                  <span>{s.number}</span>
                  <em>{s.label}</em>
                </button>
              );
            })}
          </div>
        </aside>

        <div>
          <div className="ys__main">
            <section className="ys__preview" aria-label="Live saree preview">
              <div className="ys__preview-stage">
                <div
                  className="ys__preview-image"
                  style={{
                    transform: `scale(${scale})`,
                    filter: previewFilter,
                  }}
                >
                  <Image
                    src="/indian-saree-1.jpg"
                    alt="Live preview of your Mysore silk saree"
                    fill
                    priority
                    sizes="(max-width: 1100px) 100vw, 55vw"
                  />
                  <div
                    className="ys__silk-overlay"
                    style={{
                      background:
                        toneMode === "dual" || toneMode === "contrast"
                          ? `linear-gradient(140deg, ${colour.hex} 35%, ${secondary.hex} 75%)`
                          : colour.hex,
                      opacity: toneMode === "custom" ? 0.5 : 0.4,
                    }}
                  />
                  <div className={`ys__dual-sheen${toneMode === "dual" ? " is-on" : ""}`} />
                </div>
              </div>

              <div className="ys__view-thumbs">
                {(
                  [
                    ["full", "/indian-saree-1.jpg"],
                    ["upper", "/hero-campaign.jpg"],
                    ["border", "/zari-macro.jpg"],
                    ["fabric", "/silk-threads.jpg"],
                  ] as const
                ).map(([id, src]) => (
                  <button
                    key={id}
                    type="button"
                    className={view === id ? "is-active" : ""}
                    onClick={() => setView(id)}
                    aria-label={`View ${id}`}
                  >
                    <Image src={src} alt="" fill sizes="50px" />
                  </button>
                ))}
              </div>

              <div className="ys__preview-controls">
                <div className="ys__zoom">
                  <button type="button" onClick={() => setZoom((z) => Math.max(50, z - 25))} aria-label="Zoom out">
                    −
                  </button>
                  <span>{zoom}%</span>
                  <button type="button" onClick={() => setZoom((z) => Math.min(200, z + 25))} aria-label="Zoom in">
                    +
                  </button>
                </div>
                {(
                  [
                    ["full", "Full Saree"],
                    ["upper", "Upper Body"],
                    ["border", "Border"],
                    ["pallu", "Pallu"],
                    ["fabric", "Fabric"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`ys__chip-btn${view === id ? " is-active" : ""}`}
                    onClick={() => setView(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section className="ys__panel">
              {step === "colour" && (
                <>
                  <h2>Colour &amp; Tone</h2>
                  <p className="ys__panel-sub">Choose the foundation of your saree.</p>
                  <div className="ys__modes">
                    {(
                      [
                        ["single", "Single Tone"],
                        ["dual", "Dual Tone"],
                        ["contrast", "Contrast Pallu"],
                        ["custom", "Custom"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        className={`ys__mode${toneMode === id ? " is-active" : ""}`}
                        onClick={() => setToneMode(id)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <p className="eyebrow" style={{ color: "var(--ys-gold)", marginBottom: "0.75rem" }}>
                      {toneMode === "dual" || toneMode === "contrast" ? "Primary Colour" : "Silk Swatches"}
                    </p>
                    <div className="ys__swatches">
                      {COLOURS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className={`ys__swatch${colourId === c.id ? " is-active" : ""}`}
                          style={{ background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.35), transparent 42%), ${c.hex}` }}
                          onClick={() => setColourId(c.id)}
                          aria-label={c.name}
                        >
                          <span className="ys__swatch-tip">
                            {c.name}
                            <br />
                            Pure Silk
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {(toneMode === "dual" || toneMode === "contrast") && (
                    <div>
                      <p className="eyebrow" style={{ color: "var(--ys-gold)", marginBottom: "0.75rem" }}>
                        Secondary Colour
                      </p>
                      <div className="ys__swatches">
                        {COLOURS.map((c) => (
                          <button
                            key={`s-${c.id}`}
                            type="button"
                            className={`ys__swatch${secondaryId === c.id ? " is-active" : ""}`}
                            style={{ background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.35), transparent 42%), ${c.hex}` }}
                            onClick={() => setSecondaryId(c.id)}
                            aria-label={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="ys__fabric-preview">
                    <Image src="/zari-macro.jpg" alt="Live fabric preview" fill sizes="420px" style={{ filter: colour.filter }} />
                  </div>

                  <div>
                    <p className="eyebrow" style={{ color: "var(--ys-gold)", marginBottom: "0.75rem" }}>
                      View in Different Light
                    </p>
                    <div className="ys__lights">
                      {(
                        [
                          ["natural", "Natural Light"],
                          ["warm", "Warm Light"],
                          ["cool", "Cool Light"],
                          ["indoor", "Indoor"],
                          ["evening", "Evening"],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          className={`ys__light${light === id ? " is-active" : ""}`}
                          onClick={() => setLight(id)}
                        >
                          <Image src="/hero-campaign.jpg" alt="" fill sizes="120px" style={{ filter: LIGHT_FILTER[id] }} />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === "weave" && (
                <>
                  <h2>Weave Pattern</h2>
                  <p className="ys__panel-sub">Choose the character of your silk.</p>
                  <div className="ys__option-grid">
                    {WEAVES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`ys__option${weaveId === item.id ? " is-active" : ""}`}
                        onClick={() => setWeaveId(item.id)}
                      >
                        <div className="ys__option-media">
                          <Image src={item.image} alt={item.name} fill sizes="200px" />
                        </div>
                        <div className="ys__option-copy">
                          <strong>{item.name}</strong>
                          <span>{item.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === "zari" && (
                <>
                  <h2>Zari</h2>
                  <p className="ys__panel-sub">Choose the thread that defines the light.</p>
                  <div className="ys__option-grid">
                    {ZARIS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`ys__option${zariId === item.id ? " is-active" : ""}`}
                        onClick={() => setZariId(item.id)}
                      >
                        <div className="ys__option-media">
                          <Image src={item.image} alt={item.name} fill sizes="200px" />
                        </div>
                        <div className="ys__option-copy">
                          <strong>{item.name}</strong>
                          <span>{item.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === "border" && (
                <>
                  <h2>Border</h2>
                  <p className="ys__panel-sub">The signature edge of your saree.</p>
                  <div className="ys__option-grid">
                    {BORDERS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`ys__option${borderId === item.id ? " is-active" : ""}`}
                        onClick={() => setBorderId(item.id)}
                      >
                        <div className="ys__option-media">
                          <Image src={item.image} alt={item.name} fill sizes="200px" />
                        </div>
                        <div className="ys__option-copy">
                          <strong>{item.name}</strong>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div>
                    <p className="eyebrow" style={{ color: "var(--ys-gold)", marginBottom: "0.65rem" }}>
                      Border Width
                    </p>
                    <div className="ys__seg">
                      {BORDER_WIDTHS.map((w) => (
                        <button
                          key={w}
                          type="button"
                          className={borderWidth === w ? "is-active" : ""}
                          onClick={() => setBorderWidth(w)}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === "pallu" && (
                <>
                  <h2>Pallu</h2>
                  <p className="ys__panel-sub">Make the final statement.</p>
                  <div className="ys__option-grid">
                    {PALLUS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`ys__option${palluId === item.id ? " is-active" : ""}`}
                        onClick={() => setPalluId(item.id)}
                      >
                        <div className="ys__option-media">
                          <Image src={item.image} alt={item.name} fill sizes="200px" />
                        </div>
                        <div className="ys__option-copy">
                          <strong>{item.name}</strong>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === "motifs" && (
                <>
                  <h2>Motifs</h2>
                  <p className="ys__panel-sub">Add the details that make it yours.</p>
                  <div className="ys__option-grid">
                    {MOTIFS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`ys__option${motifId === item.id ? " is-active" : ""}`}
                        onClick={() => setMotifId(item.id)}
                      >
                        <div className="ys__option-media">
                          <Image src={item.image} alt={item.name} fill sizes="200px" />
                        </div>
                        <div className="ys__option-copy">
                          <strong>{item.name}</strong>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div>
                    <p className="eyebrow" style={{ color: "var(--ys-gold)", marginBottom: "0.65rem" }}>
                      Motif Size
                    </p>
                    <div className="ys__seg">
                      {MOTIF_SIZES.map((v) => (
                        <button key={v} type="button" className={motifSize === v ? "is-active" : ""} onClick={() => setMotifSize(v)}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow" style={{ color: "var(--ys-gold)", marginBottom: "0.65rem" }}>
                      Motif Density
                    </p>
                    <div className="ys__seg">
                      {MOTIF_DENSITIES.map((v) => (
                        <button
                          key={v}
                          type="button"
                          className={motifDensity === v ? "is-active" : ""}
                          onClick={() => setMotifDensity(v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow" style={{ color: "var(--ys-gold)", marginBottom: "0.65rem" }}>
                      Motif Placement
                    </p>
                    <div className="ys__seg">
                      {MOTIF_PLACEMENTS.map((v) => (
                        <button
                          key={v}
                          type="button"
                          className={motifPlacement === v ? "is-active" : ""}
                          onClick={() => setMotifPlacement(v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === "preview" && (
                <>
                  <h2>Your Saree</h2>
                  <p className="ys__panel-sub">
                    Designed by you. Crafted by our artisans. Made in Mysuru. Created for generations.
                  </p>
                  <div className="ys__chips" style={{ marginBottom: "0.5rem" }}>
                    <span className="ys__chip" style={{ color: "var(--ys-ink)", borderColor: "rgba(26,21,18,0.15)" }}>
                      {colour.name}
                    </span>
                    <span className="ys__chip" style={{ color: "var(--ys-ink)", borderColor: "rgba(26,21,18,0.15)" }}>
                      {weave.name}
                    </span>
                    <span className="ys__chip" style={{ color: "var(--ys-ink)", borderColor: "rgba(26,21,18,0.15)" }}>
                      {zari.name}
                    </span>
                    <span className="ys__chip" style={{ color: "var(--ys-ink)", borderColor: "rgba(26,21,18,0.15)" }}>
                      {border.name}
                    </span>
                    <span className="ys__chip" style={{ color: "var(--ys-ink)", borderColor: "rgba(26,21,18,0.15)" }}>
                      {pallu.name}
                    </span>
                    <span className="ys__chip" style={{ color: "var(--ys-ink)", borderColor: "rgba(26,21,18,0.15)" }}>
                      {motif.name}
                    </span>
                  </div>
                  <p className="ys__price" style={{ color: "var(--ys-ink)" }}>
                    {formatINR(total)}
                  </p>
                </>
              )}

              {step !== "preview" ? (
                <button type="button" className="ys__next" onClick={nextStep}>
                  Continue <span aria-hidden="true">→</span>
                </button>
              ) : (
                <button type="button" className="ys__next" onClick={() => setModal("cart")}>
                  Add to Cart
                </button>
              )}
            </section>
          </div>

          <div className="ys__rail" style={{ marginTop: "1.1rem" }}>
            {[
              { step: "weave" as StepId, label: "02 Weave Pattern", image: weave.image, name: weave.name },
              { step: "zari" as StepId, label: "03 Zari Type", image: zari.image, name: zari.name },
              { step: "border" as StepId, label: "04 Border Design", image: border.image, name: border.name },
              { step: "pallu" as StepId, label: "05 Pallu Design", image: pallu.image, name: pallu.name },
              { step: "motifs" as StepId, label: "06 Motifs (Butta)", image: motif.image, name: motif.name },
            ].map((card) => (
              <button key={card.step} type="button" className="ys__rail-card" onClick={() => goStep(card.step)}>
                <Image src={card.image} alt="" fill sizes="200px" />
                <div>
                  <strong>{card.label}</strong>
                  <span>{card.name}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="ys__summary">
            <div>
              <h3>Your Creation</h3>
              <div className="ys__chips">
                <button type="button" className="ys__chip" onClick={() => goStep("colour")}>
                  {colour.name}
                </button>
                <button type="button" className="ys__chip" onClick={() => goStep("colour")}>
                  {toneMode === "single" ? "Single Tone" : toneMode === "dual" ? "Dual Tone" : toneMode === "contrast" ? "Contrast Pallu" : "Custom"}
                </button>
                <button type="button" className="ys__chip" onClick={() => goStep("weave")}>
                  {weave.name}
                </button>
                <button type="button" className="ys__chip" onClick={() => goStep("zari")}>
                  {zari.name}
                </button>
                <button type="button" className="ys__chip" onClick={() => goStep("border")}>
                  {border.name}
                </button>
                <button type="button" className="ys__chip" onClick={() => goStep("pallu")}>
                  {pallu.name}
                </button>
                <button type="button" className="ys__chip" onClick={() => goStep("motifs")}>
                  {motif.name}
                </button>
              </div>
            </div>

            <div className="ys__buy">
              <div className="ys__price">
                {formatINR(total)}
                <button
                  type="button"
                  className="ys__price-btn"
                  aria-label="Price breakdown"
                  onClick={() => setShowBreakdown((v) => !v)}
                >
                  ⓘ
                </button>
                <small>Estimated price</small>
              </div>
              {showBreakdown && (
                <div className="ys__breakdown">
                  {breakdown.map((row) => (
                    <div key={row.label}>
                      <span>{row.label}</span>
                      <span>{formatINR(row.value)}</span>
                    </div>
                  ))}
                  <div className="total">
                    <span>Total</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>
              )}
              <div className="ys__actions">
                <button type="button" className="primary" onClick={() => setModal("cart")}>
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setDesignId(createDesignId());
                    setModal("save");
                  }}
                >
                  Save Design
                </button>
                <button type="button" className="secondary" onClick={() => setModal("share")}>
                  Share My Design
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ys__services">
        <div className="ys__service">
          <strong>Consult Our Experts</strong>
          Need help creating your saree?
        </div>
        <div className="ys__service">
          <strong>Book an Appointment</strong>
          Visit our Mysuru atelier.
        </div>
        <div className="ys__service">
          <strong>Share Your Design</strong>
          Send your creation privately.
        </div>
        <div className="ys__service">
          <strong>Crafted for Generations</strong>
          Made in Mysuru since 1912.
        </div>
      </div>

      <section className="ys__craft">
        <h3>Made in Mysuru</h3>
        <p>Every choice becomes a thread. Every thread becomes your story.</p>
        <div className="ys__craft-grid">
          {[
            ["/silk-threads.jpg", "Silk Threads"],
            ["/loom-craft.jpg", "The Loom"],
            ["/gold-thread.jpg", "Zari"],
            ["/zari-macro.jpg", "Border Weaving"],
          ].map(([src, label]) => (
            <div className="ys__craft-card" key={label}>
              <Image src={src} alt={label} fill sizes="280px" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {modal && (
        <div className="ys__modal" role="dialog" aria-modal="true">
          <div className="ys__modal-card">
            {modal === "save" && (
              <>
                <h3>Design Saved</h3>
                <p className="code">{designId}</p>
                <p>
                  {colour.name} · {weave.name} · {zari.name} · {border.name} · {pallu.name} · {motif.name}
                </p>
                <p>{formatINR(total)}</p>
              </>
            )}
            {modal === "share" && (
              <>
                <h3>I designed my Mysore Silk Saree.</h3>
                <p className="code">{designId}</p>
                <p>
                  A private design certificate for your creation — colour, zari, border, pallu and motifs,
                  estimated at {formatINR(total)}.
                </p>
              </>
            )}
            {modal === "cart" && (
              <>
                <h3>Your Saree</h3>
                <p>
                  Designed by you. Crafted by our artisans. Made in Mysuru. Created for generations.
                </p>
                <p className="code">{formatINR(total)}</p>
              </>
            )}
            <div className="ys__modal-actions">
              {modal === "cart" ? (
                <button type="button" className="primary" onClick={() => setModal(null)}>
                  Confirm Add to Cart
                </button>
              ) : (
                <button type="button" className="primary" onClick={() => setModal(null)}>
                  Continue
                </button>
              )}
              <button type="button" className="ghost" onClick={() => setModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
