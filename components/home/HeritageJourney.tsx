"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const panels = [
  {
    n: "01",
    titleLines: ["A Royal", "Beginning"],
    meta: "1912",
    copyLines: ["A royal vision", "to create a silk", "unlike any other."],
    image: "/heritage/01.jpg?v=4",
    imageWide: "/heritage/01-wide.jpg?v=5",
    detail:
      "In 1912, under the patronage of the Wadiyar dynasty, Mysore Silk was born as a royal commission — not merely cloth, but a standard of excellence. The house set out to weave a silk so pure and luminous that it would stand apart from every other tradition in India.",
  },
  {
    n: "02",
    titleLines: ["The Finest", "Silk"],
    meta: "Selected",
    copyLines: ["From the finest", "mulberry silkworms."],
    image: "/heritage/02.jpg?v=4",
    imageWide: "/heritage/02-wide.jpg?v=5",
    detail:
      "Only the finest mulberry silk is chosen — long, continuous filaments with a natural sheen that cannot be imitated. Each skein is graded for strength, lustre, and hand-feel before it ever reaches the loom.",
  },
  {
    n: "03",
    titleLines: ["Skilled", "Artisans"],
    meta: "In Mysuru",
    copyLines: ["In the hands of", "master weavers."],
    image: "/heritage/03.jpg?v=4",
    imageWide: "/heritage/03-wide.jpg?v=5",
    detail:
      "In Mysuru’s weaving halls, master artisans carry techniques passed through generations. Their hands set the tension, place the zari, and give each saree its quiet authority — craft that no machine can fully reproduce.",
  },
  {
    n: "04",
    titleLines: ["A Distinctive", "Sheen"],
    meta: "Signature",
    copyLines: ["A texture and lustre", "that sets it apart."],
    image: "/heritage/04.jpg?v=4",
    imageWide: "/heritage/04-wide.jpg?v=5",
    detail:
      "Mysore Silk is recognised by its signature sheen — a soft, living lustre that shifts with light. The weave holds depth without heaviness, so the fabric drapes with grace and catches gold in every fold.",
  },
  {
    n: "05",
    titleLines: ["Adorned by", "Royalty"],
    meta: "Cherished",
    copyLines: ["Worn by queens,", "cherished by generations."],
    image: "/heritage/05.jpg?v=4",
    imageWide: "/heritage/05-wide.jpg?v=5",
    detail:
      "From palace ceremonies to family milestones, Mysore Silk has dressed queens and been kept as heirloom. Each piece is meant to be worn, remembered, and passed on — a presence in the wardrobe of generations.",
  },
  {
    n: "06",
    titleLines: ["Recognised", "Worldwide"],
    meta: "Beyond Mysuru",
    copyLines: ["From Mysuru", "to the world."],
    image: "/heritage/06.jpg?v=3",
    imageWide: "/heritage/06.jpg?v=3",
    stagePosition: "center 18%",
    detail:
      "What began in Mysuru is now recognised across continents. Collectors and connoisseurs seek the same purity of silk and precision of zari that once defined a royal atelier — heritage that travels without losing its origin.",
  },
  {
    n: "07",
    titleLines: ["A Timeless", "Legacy"],
    meta: "Today",
    copyLines: ["A saree that", "continues to inspire", "the world."],
    image: "/heritage/07.jpg?v=3",
    imageWide: "/heritage/07.jpg?v=3",
    stagePosition: "center 18%",
    detail:
      "Today the legacy continues — woven for the present, made to be inherited. Mysore Silk remains a living tradition: one saree, one story, still inspiring how beauty and craftsmanship endure.",
  },
];

export default function HeritageJourney() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const chapter = panels[active];
  const total = String(panels.length).padStart(2, "0");

  const openChapter = (index: number) => {
    const next = ((index % panels.length) + panels.length) % panels.length;
    setActive(next);
    setOpened(true);
    setContentKey((k) => k + 1);
  };

  const showAll = () => setOpened(false);

  const prev = () => openChapter(active - 1);
  const next = () => openChapter(active + 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (opened) {
          setOpened(false);
          return;
        }
        router.push("/#heritage");
        return;
      }
      if (!opened) return;
      if (e.key === "ArrowRight") openChapter(active + 1);
      if (e.key === "ArrowLeft") openChapter(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened, active, router]);

  if (!opened) {
    return (
      <section className="hj hj--all" id="heritage" aria-label="The Heritage of Mysore Silk">
        <div className="hj__seven" role="list">
          {panels.map((panel, i) => (
            <button
              key={panel.n}
              type="button"
              role="listitem"
              className="hj__seven-item"
              onClick={() => openChapter(i)}
              aria-label={`Open chapter ${panel.n}: ${panel.titleLines.join(" ")}`}
            >
              <Image src={panel.image} alt="" fill sizes="15vw" className="hj__seven-img" />
              <span className="hj__seven-copy">
                <span className="hj__seven-n">{panel.n}</span>
                <strong>{panel.titleLines.join(" ")}</strong>
              </span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="hj" id="heritage" aria-label="The Heritage of Mysore Silk">
      <div
        className="hj__stage"
        aria-live="polite"
        onClick={showAll}
        aria-label="Show all seven chapters"
      >
        {panels.map((panel, i) => (
          <div
            key={panel.n}
            className={`hj__bg${i === active ? " is-active" : ""}`}
            aria-hidden={i !== active}
          >
            <Image
              src={panel.imageWide ?? panel.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="hj__bg-img"
              style={panel.stagePosition ? { objectPosition: panel.stagePosition } : undefined}
            />
          </div>
        ))}

        <div className="hj__grade" aria-hidden="true" />
        <div className="hj__vignette" aria-hidden="true" />
        <div className="hj__grain" aria-hidden="true" />

        <nav
          className="hj__rail"
          aria-label="Chapters"
          onClick={(e) => e.stopPropagation()}
        >
          {panels.map((panel, i) => (
            <button
              key={panel.n}
              type="button"
              className={`hj__rail-item${i === active ? " is-current" : ""}`}
              onClick={() => openChapter(i)}
              aria-current={i === active ? "true" : undefined}
              aria-label={`Chapter ${panel.n}: ${panel.titleLines.join(" ")}`}
            >
              <span className="hj__rail-media" aria-hidden="true">
                <Image src={panel.image} alt="" fill sizes="56px" />
              </span>
              <span className="hj__rail-n">{panel.n}</span>
            </button>
          ))}
        </nav>

        <div className="hj__chrome" onClick={(e) => e.stopPropagation()}>
          <span className="hj__chrome-count">
            {chapter.n} / {total}
          </span>
          <div className="hj__chrome-arrows">
            <button type="button" className="hj__nav-btn" onClick={prev} aria-label="Previous chapter">
              ←
            </button>
            <button type="button" className="hj__nav-btn" onClick={next} aria-label="Next chapter">
              →
            </button>
          </div>
        </div>

        <aside
          key={contentKey}
          className="hj__medallion"
          aria-label={`${chapter.titleLines.join(" ")} — Chapter ${chapter.n}`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="hj__medallion-ring" aria-hidden="true" />

          <span className="hj__lotus" aria-hidden="true">
            <svg viewBox="0 0 48 36" fill="none">
              <path
                d="M24 32c-3.2-4.8-9.8-8.2-14.5-9.2 3.6-1.2 7.8-.6 11.2 1.6C18.4 18 16 11.5 16 6c3.2 2.8 6.4 7.2 8 12.2C25.6 13.2 28.8 8.8 32 6c0 5.5-2.4 12-4.7 18.4 3.4-2.2 7.6-2.8 11.2-1.6C33.8 23.8 27.2 27.2 24 32Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="currentColor"
                fillOpacity="0.18"
              />
              <path d="M24 30V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            </svg>
          </span>

          <p className="hj__chapter">Chapter {chapter.n}</p>
          <p className="hj__meta">{chapter.meta}</p>

          <h1 className="hj__title">
            {chapter.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>

          <div className="hj__rule" aria-hidden="true">
            <span />
            <i>◆</i>
            <span />
          </div>

          <p className="hj__lead">{chapter.copyLines.join(" ")}</p>
          <p className="hj__body">{chapter.detail}</p>

          <div className="hj__footer-nav" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="hj__nav-btn hj__nav-btn--sm" onClick={prev} aria-label="Previous chapter">
              ←
            </button>
            <span className="hj__footer-line" aria-hidden="true" />
            <span className="hj__footer-count">
              {chapter.n} / {total}
            </span>
            <span className="hj__footer-line" aria-hidden="true" />
            <button type="button" className="hj__nav-btn hj__nav-btn--sm" onClick={next} aria-label="Next chapter">
              →
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
