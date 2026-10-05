import Image from "next/image";
import Link from "next/link";

export default function Heritage() {
  return (
    <section className="heritage" id="heritage">
      <figure className="heritage__image">
        <div className="media-fill">
          <Image
            src="/generations.jpg"
            alt="Three generations of women in Mysore silk"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </figure>

      <div className="heritage__panel">
        <div className="heritage__copy">
          <p className="eyebrow">Heritage</p>
          <h2 className="display display--light">
            Three generations.
            <br />
            One piece of silk.
          </h2>
          <p className="heritage__lead">
            Some things are bought.
            <br />
            Some things are passed down.
          </p>
          <span className="heritage__rule" aria-hidden="true" />
          <Link className="btn btn--text btn--on-dark" href="/heritage">
            Our Story <span aria-hidden="true">→</span>
          </Link>
        </div>

        <figure className="heritage__loom">
          <div className="media-fill">
            <Image
              src="/hands-weave.jpg"
              alt="Hands weaving silk on a loom"
              fill
              sizes="(max-width: 900px) 100vw, 28vw"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
