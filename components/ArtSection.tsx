"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ArtSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const sync = (shouldPlay: boolean) => {
      if (shouldPlay) {
        const attempt = video.play();
        if (attempt) {
          attempt.then(() => setPlaying(true)).catch(() => setPlaying(false));
        }
      } else {
        video.pause();
        setPlaying(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        sync(entry.isIntersecting && entry.intersectionRatio >= 0.45);
      },
      { threshold: [0, 0.45, 0.75] }
    );

    observer.observe(section);

    const onVisibility = () => {
      if (document.hidden) {
        sync(false);
        return;
      }
      const rect = section.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      sync(visible / Math.max(section.offsetHeight, 1) >= 0.45);
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section ref={sectionRef} className={`art${playing ? " is-playing" : ""}`} id="silk">
      <div className="art__film" aria-label="The story of Mysore Silk">
        <video
          ref={videoRef}
          className="art__video"
          src="/films/spliced.mp4?v=3"
          muted
          playsInline
          loop
          preload="metadata"
          poster="/zari-macro.jpg"
        />
        <div className="art__film-ui">
          <span className="play" aria-hidden="true">
            <svg viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="27" fill="none" stroke="currentColor" strokeWidth="0.7" />
              <path d="M24 19l14 9-14 9V19z" fill="currentColor" />
            </svg>
          </span>
          <p>
            The Story of
            <br />
            Mysore Silk
          </p>
          <span className="btn btn--text btn--on-dark">Watch Film</span>
        </div>
      </div>

      <div className="art__panel">
        <p className="eyebrow">The Art of Mysore Silk</p>
        <h2 className="display">
          More than a saree.
          <br />
          A living tradition.
        </h2>
        <p className="body">
          Woven in Mysuru, our silk is a celebration of craftsmanship, culture and timeless
          beauty. Each piece carries a history, a heritage and a promise — to last for
          generations.
        </p>
        <Link className="btn btn--text" href="#categories">
          Explore Our Craft <span aria-hidden="true">→</span>
        </Link>
        <div className="palace-sketch" aria-hidden="true">
          <svg viewBox="0 0 360 140" fill="none" stroke="currentColor" strokeWidth="0.65">
            <path d="M18 118h324" />
            <path d="M42 118V68l22-20 22 20v50" />
            <path d="M108 118V52l38-32 38 32v66" />
            <path d="M206 118V68l22-20 22 20v50" />
            <path d="M272 118V78l18-14 18 14v40" />
            <path d="M128 52h76" />
            <path d="M148 24v12M166 14v22M184 24v12" />
            <circle cx="166" cy="10" r="2.8" />
            <path d="M56 82h36M220 82h36M120 82h80" />
            <path d="M140 70h52M148 90h36" />
          </svg>
        </div>
      </div>
    </section>
  );
}
