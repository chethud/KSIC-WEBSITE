"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const panels = [
  {
    n: "01",
    titleLines: ["A Royal", "Vision"],
    meta: "1912 · Born for the Palace",
    copyLines: [],
    image: "/heritage/01.jpg?v=6",
    imageWide: "/heritage/01-wide.jpg?v=5",
    detail:
      "In 1912, Maharaja Nalwadi Krishnaraja Wadiyar IV established the Mysore silk weaving factory in Mysuru. His vision was to create silk of exceptional quality for the royal household and the ceremonial needs of the state. Swiss looms and preparatory machinery were brought to Mysuru, creating one of the earliest technologically advanced silk weaving operations of its kind in India. What began as a royal requirement would become a defining textile tradition of Karnataka.",
  },
  {
    n: "02",
    titleLines: ["Before the Saree,", "the Silk"],
    meta: "1785 · The First Thread",
    copyLines: [],
    image: "/heritage/02.jpg?v=4",
    imageWide: "/heritage/02-wide.jpg?v=5",
    detail:
      "The story reaches further back than the 1912 factory. During the reign of Tipu Sultan, sericulture was introduced and developed in the Mysore kingdom; the Government of Mysuru dates the establishment of sericulture at Channapatna to 1785. Historical accounts describe silk expertise and silkworm cultivation being developed through connections with Bengal, laying the agricultural foundation on which Mysore’s later silk industry would grow.",
  },
  {
    n: "03",
    titleLines: ["Knowledge", "Became Craft"],
    meta: "The Artisan",
    copyLines: [],
    image: "/heritage/03.jpg?v=4",
    imageWide: "/heritage/03-wide.jpg?v=5",
    detail:
      "Silk could not become a luxury without people who understood it. Mysore’s silk industry grew alongside organised technical training, including the Tata Silk Farm and training centre established in Bengaluru with Japanese expertise in the early 1900s. This exchange of knowledge helped build a generation of people skilled in sericulture, silk processing and weaving — and gave Mysore the technical foundation to pursue exceptional silk production.",
  },
  {
    n: "04",
    titleLines: ["The Signature", "of Mysore"],
    meta: "Silk · Silver · Gold",
    copyLines: [],
    image: "/heritage/04.jpg?v=4",
    imageWide: "/heritage/04-wide.jpg?v=5",
    detail:
      "The character of Mysore Silk lies in restraint. Fine natural silk provides its smooth hand and luminous drape, while its distinctive zari brings the precious element. Traditional Mysore Silk zari is built predominantly with silver and a measured quantity of gold — the recognised specification is 65% pure silver and 0.65% gold, with the precious metal worked into the zari construction. The result is not loud ornamentation, but a quiet glow that changes beautifully with light.",
  },
  {
    n: "05",
    titleLines: ["Woven for", "Royalty"],
    meta: "A Silk Fit for Royalty",
    copyLines: [],
    image: "/heritage/05.jpg?v=4",
    imageWide: "/heritage/05-wide.jpg?v=5",
    detail:
      "The earliest Mysore silk fabrics were created for the royal family and the state’s ceremonial needs. Silk became part of the visual language of the Wadiyar court. Its elegance was never about excess, but refinement, purity and presence. That royal character remains woven into every authentic Mysore Silk saree.",
  },
  {
    n: "06",
    titleLines: ["Mysuru to", "the World"],
    meta: "A Name Recognised",
    copyLines: [],
    image: "/heritage/06.jpg?v=3",
    imageWide: "/heritage/06.jpg?v=3",
    stagePosition: "center 18%",
    detail:
      "Mysore Silk grew from a royal tradition into one of India’s most recognised silk identities. Its reputation is built on pure silk, distinctive sheen and precious zari. The Geographical Indication registered Mysore Silk as a protected regional identity. What began in Mysuru became a name admired far beyond Karnataka.",
  },
  {
    n: "07",
    titleLines: ["A Legacy", "That Endures"],
    meta: "Made to Be Passed Down",
    copyLines: [],
    image: "/heritage/07.jpg?v=3",
    imageWide: "/heritage/07.jpg?v=3",
    stagePosition: "center 18%",
    detail:
      "More than a century later, the tradition continues through KSIC and its Mysuru manufacturing heritage. Authenticity, pure silk, precious zari and controlled craftsmanship remain at its heart. Every saree carries its own identity, protecting the name and the legacy behind it. That is why Mysore Silk remains one of India’s most prestigious silk traditions.",
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

  useEffect(() => {
    const requested = Number(new URLSearchParams(window.location.search).get("chapter"));
    if (requested >= 1 && requested <= panels.length) openChapter(requested - 1);
    // Open a journal chapter once, from the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <Image src={panel.image} alt="" fill sizes="(max-width: 899px) 78vw, 15vw" quality={90} className="hj__seven-img" />
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

          {chapter.copyLines.length > 0 && (
            <p className="hj__lead">{chapter.copyLines.join(" ")}</p>
          )}
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
