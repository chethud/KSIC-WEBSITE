import Image from "next/image";
import Link from "next/link";

function PalaceSketch() {
  return (
    <svg
      className="between-hero__palace"
      viewBox="0 0 360 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.65"
      aria-hidden="true"
    >
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
  );
}

export default function BetweenHero() {
  return (
    <section className="between-hero" id="between" aria-label="The art of Mysore silk">
      <div className="between-hero__inner">
        <figure className="between-hero__media">
          <Image
            src="/hands-weave.jpg"
            alt="Artisan hands weaving Mysore silk on a loom"
            fill
            sizes="(max-width: 900px) 100vw, 48vw"
            className="between-hero__img"
          />
        </figure>

        <div className="between-hero__panel">
          <p className="between-hero__eyebrow">The Art of Mysore Silk</p>
          <h2 className="between-hero__title">
            A Legacy Woven
            <br />
            Since 1912
          </h2>
          <div className="between-hero__rule" aria-hidden="true" />
          <p className="between-hero__lead">
            Mysore Silk is a timeless legacy of royal heritage — woven in Mysuru with pure
            mulberry silk and antique-gold zari, made to be worn and passed down.
          </p>
          <Link className="between-hero__cta" href="/story">
            Discover our story <span aria-hidden="true">→</span>
          </Link>

          <PalaceSketch />

          <ul className="between-hero__marks">
            <li>
              <span className="between-hero__mark" aria-hidden="true">◇</span>
              <span>
                100% Pure
                <br />
                Silk
              </span>
            </li>
            <li>
              <span className="between-hero__mark" aria-hidden="true">◇</span>
              <span>Gold Zari</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
