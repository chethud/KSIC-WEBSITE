"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const miniStories = [
  {
    n: "01",
    title: "The Silk",
    copy: "Pure. Rare. Enduring.",
    image: "/silk-threads.jpg",
    href: "#silk",
  },
  {
    n: "02",
    title: "The Zari",
    copy: "Gold & Silver in every thread.",
    image: "/gold-thread.jpg",
    href: "#silk",
  },
  {
    n: "03",
    title: "The Weave",
    copy: "A tradition of mastery.",
    image: "/loom-craft.jpg",
    href: "#categories",
  },
  {
    n: "04",
    title: "The Heirloom",
    copy: "Meant for generations.",
    image: "/heirloom.jpg",
    href: "#heritage",
  },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    hero.classList.add("is-settled");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight && layerRef.current) {
        const px = cx / window.innerWidth - 0.5;
        const py = cy / window.innerHeight - 0.5;
        layerRef.current.style.translate = `${px * -16}px ${py * -9}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      if (layerRef.current) {
        layerRef.current.style.scale = String(1 + progress * 0.05);
      }
      if (copyRef.current) {
        copyRef.current.style.opacity = String(1 - progress * 1.2);
        copyRef.current.style.translate = `0 ${progress * 28}px`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__stage">
        <div className="hero__layer" ref={layerRef}>
          <div className="media-fill">
            <Image
              src="/hero-bg.png"
              alt="Woman in Mysore silk saree within palace architecture"
              fill
              priority
              sizes="100vw"
              quality={90}
            />
          </div>
        </div>
        <div className="hero__veil" />
      </div>

      <div className="hero__copy" ref={copyRef}>
        <p className="eyebrow eyebrow--light">A Legacy in Every Thread</p>
        <h1 className="hero__title">
          <span>Mysore</span>
          <span>Silk</span>
        </h1>
        <p className="hero__lead">Made to be inherited.</p>
        <p className="hero__body">
          Woven in Mysuru. Cherished today.
          <br />
          Passed to tomorrow.
        </p>
        <a className="btn btn--outline" href="#collection">
          Explore the Collection <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="hero__bottom">
        <a href="#silk" className="zari-card">
          <div className="zari-card__media">
            <Image src="/zari-macro.jpg?v=2" alt="Mysore silk zari detail" fill sizes="56px" />
          </div>
          <div className="zari-card__copy">
            <strong>
              Experience
              <br />
              the Zari
            </strong>
            <span>Zoom into details</span>
          </div>
          <span className="zari-card__arrow" aria-hidden="true">
            →
          </span>
        </a>

        <div className="hero__stories">
          {miniStories.map((s) => (
            <a key={s.n} href={s.href} className="hero-story">
              <div className="hero-story__media">
                <Image src={s.image} alt={s.title} fill sizes="90px" />
              </div>
              <div>
                <span>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="hero__aside">
          <Link href="/heritage" className="watch-story">
            <span className="watch-story__play" aria-hidden="true">
              ▶
            </span>
            <span>
              Watch
              <br />
              Our Story
            </span>
          </Link>
          <a href="#silk" className="scroll-cue" aria-label="Scroll to The Silk">
            <span />
          </a>
        </div>
      </div>
    </section>
  );
}
