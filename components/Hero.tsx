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
  },
  {
    n: "02",
    title: "The Zari",
    copy: "Gold & Silver in every thread.",
    image: "/gold-thread.jpg",
  },
  {
    n: "03",
    title: "The Weave",
    copy: "A tradition of mastery.",
    image: "/loom-craft.jpg",
  },
  {
    n: "04",
    title: "The Heirloom",
    copy: "Meant for generations.",
    image: "/heirloom.jpg",
  },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      if (!copyRef.current) return;
      copyRef.current.style.opacity = String(1 - progress * 1.2);
      copyRef.current.style.translate = progress === 0 ? "" : `0 ${progress * 28}px`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pageshow", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pageshow", onScroll);
      if (copyRef.current) {
        copyRef.current.style.opacity = "";
        copyRef.current.style.translate = "";
      }
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__stage">
        <div className="hero__layer">
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
        <div className="hero__ctas">
          <Link className="btn btn--outline" href="/sarees">
            Explore silk <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn btn--gold" href="/your-saree">
            Enter 3D studio
          </Link>
        </div>
      </div>

      <div className="hero__bottom">
        <a href="#silk" className="zari-card">
          <div className="zari-card__media">
            <Image src="/zari-macro.jpg?v=2" alt="Mysore silk zari detail" fill sizes="220px" />
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
            <div key={s.n} className="hero-story">
              <div className="hero-story__media">
                <Image src={s.image} alt="" fill sizes="90px" />
              </div>
              <div>
                <span>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
