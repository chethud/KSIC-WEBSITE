"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    const attempt = video.play();
    if (attempt) {
      attempt.catch(() => {
        /* autoplay may be blocked; muted + playsInline should usually allow it */
      });
    }
  }, []);

  return (
    <section className="hero" id="hero" aria-label="Mysore Silk">
      <h1 className="sr-only">Mysore Silk</h1>
      <div className="hero__stage">
        <div className="hero__layer">
          <div className="media-fill">
            <video
              ref={videoRef}
              className="hero__video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/hero-bg.png"
              aria-label="Mysore silk in motion"
            >
              <source src="/hero-home.mp4?v=8bfeca5e" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="hero__veil" />
      </div>
    </section>
  );
}
