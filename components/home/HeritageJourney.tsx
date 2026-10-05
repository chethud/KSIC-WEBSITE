"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Emblem from "../Emblem";

const panels = [
  {
    n: "01",
    title: "A Royal Beginning",
    meta: "1912",
    copy: "A royal vision created a silk unlike any other.",
    image: "/heritage-palace.jpg",
    tone: "warm",
  },
  {
    n: "02",
    title: "The Finest Silk",
    meta: "Selected",
    copy: "From the finest mulberry silk.",
    image: "/silk-threads.jpg",
    tone: "light",
  },
  {
    n: "03",
    title: "Mastered by Hand",
    meta: "In Mysuru",
    copy: "In the hands of master weavers.",
    image: "/loom-craft.jpg",
    tone: "warm",
  },
  {
    n: "04",
    title: "The Signature Sheen",
    meta: "Distinctive",
    copy: "A lustre that sets it apart.",
    image: "/zari-macro.jpg",
    tone: "rich",
  },
  {
    n: "05",
    title: "Worn by Royalty",
    meta: "Cherished",
    copy: "Cherished by generations.",
    image: "/collection-1.jpg",
    tone: "sepia",
  },
  {
    n: "06",
    title: "From Mysuru to the World",
    meta: "Recognised",
    copy: "A heritage that travelled far beyond its home.",
    image: "/indian-saree-1.jpg",
    tone: "mono",
  },
  {
    n: "07",
    title: "A Timeless Legacy",
    meta: "Today",
    copy: "A saree made to become part of your story.",
    image: "/hero-bg.jpg",
    tone: "hero",
  },
];

export default function HeritageJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const thread = threadRef.current;
    const glow = glowRef.current;
    if (!section || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = () => window.matchMedia("(max-width: 899px)").matches;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const index = Math.min(panels.length - 1, Math.floor(progress * panels.length));
      setActive(index);

      if (!isMobile() && !reduced) {
        const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
        track.style.transform = `translate3d(${-progress * maxX}px, 0, 0)`;
      } else {
        track.style.transform = "none";
      }

      if (thread) {
        const length = thread.getTotalLength();
        thread.style.strokeDasharray = `${length}`;
        thread.style.strokeDashoffset = `${length * (1 - progress)}`;
      }
      if (glow) {
        const length = glow.getTotalLength();
        glow.style.strokeDasharray = `${length}`;
        glow.style.strokeDashoffset = `${length * (1 - progress)}`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="hj" id="heritage" ref={sectionRef} aria-label="The Heritage of Mysore Silk">
      <div className="hj__grain" aria-hidden="true" />
      <div className="hj__sticky">
        <header className="hj__header">
          <div className="hj__logo">
            <Emblem />
          </div>
          <p className="hj__eyebrow">A Journey of Excellence</p>
          <h1 className="hj__title">
            <span className="hj__rule" aria-hidden="true" />
            <span className="hj__diamond" aria-hidden="true">
              ◆
            </span>
            <span className="hj__title-text">The Heritage of Mysore Silk</span>
            <span className="hj__diamond" aria-hidden="true">
              ◆
            </span>
            <span className="hj__rule" aria-hidden="true" />
          </h1>
          <p className="hj__sub">A Saree Beyond Time</p>
        </header>

        <div className="hj__viewport">
          <div className="hj__track" ref={trackRef}>
            <svg
              className="hj__thread"
              viewBox="0 0 2800 140"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={glowRef}
                className="hj__thread-glow"
                d="M40 78 C 220 18, 380 120, 560 70 S 900 16, 1120 84 S 1480 122, 1700 62 S 2060 14, 2280 78 S 2560 118, 2760 56"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                ref={threadRef}
                className="hj__thread-line"
                d="M40 78 C 220 18, 380 120, 560 70 S 900 16, 1120 84 S 1480 122, 1700 62 S 2060 14, 2280 78 S 2560 118, 2760 56"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
              />
            </svg>

            {panels.map((panel, i) => (
              <article
                key={panel.n}
                className={`hj__panel hj__panel--${panel.tone}${i === active ? " is-active" : ""}`}
              >
                <div className="hj__panel-media">
                  <Image
                    src={panel.image}
                    alt={panel.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 24vw"
                    priority={i === 0}
                  />
                  <div className="hj__panel-veil" />
                </div>

                <div className="hj__panel-top">
                  <span>{panel.n}</span>
                  <em>/</em>
                  <strong>{panel.title}</strong>
                  <em>/</em>
                  <span>{panel.meta}</span>
                </div>

                <p className="hj__panel-copy">{panel.copy}</p>
                <span className="hj__panel-diamond" aria-hidden="true">
                  ◆
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="hj__progress" aria-hidden="true">
          {panels.map((panel, i) => (
            <span key={panel.n} className={i === active ? "is-active" : undefined} />
          ))}
        </div>

        <footer className="hj__footer">
          <h2>A Saree Beyond Time</h2>
          <p>MysoreSilk — Heritage Woven Forward.</p>
        </footer>
      </div>
    </section>
  );
}
