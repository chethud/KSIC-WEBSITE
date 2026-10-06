import Image from "next/image";
import Link from "next/link";

export default function Heritage() {
  return (
    <section className="heritage" id="heritage" aria-label="Heritage">
      <div className="heritage__atmosphere" aria-hidden="true" />

      <figure className="heritage__image">
        <div className="media-fill">
          <Image
            src="/generations.jpg?v=3"
            alt="Three generations of women in Mysore silk"
            fill
            sizes="(max-width: 900px) 100vw, 42vw"
            priority={false}
          />
        </div>
      </figure>

      <div className="heritage__panel">
        <div className="heritage__copy">
          <p className="heritage__eyebrow">Heritage</p>
          <h2 className="heritage__title">
            Three generations.
            <br />
            One piece of silk.
          </h2>
          <p className="heritage__lead">
            Some things are bought.
            <br />
            Some things are passed down.
          </p>
          <Link className="heritage__cta" href="/heritage">
            Our Story <span aria-hidden="true">→</span>
          </Link>
        </div>

        <figure className="heritage__loom">
          <div className="media-fill">
            <Image
              src="/hands-weave.jpg?v=2"
              alt="Hands weaving silk on a loom"
              fill
              sizes="(max-width: 900px) 90vw, 32vw"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
