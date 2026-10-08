export default function Hero() {
  return (
    <section className="hero" id="hero" aria-label="Mysore Silk">
      <h1 className="sr-only">Mysore Silk</h1>
      <div className="hero__stage">
        <div className="hero__layer">
          <div className="media-fill">
            <video
              className="hero__video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/hero-bg.png"
              aria-label="Mysore silk in motion"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="hero__veil" />
      </div>
    </section>
  );
}
