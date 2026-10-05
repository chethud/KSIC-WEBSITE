import Image from "next/image";

export default function FinaleSection() {
  return (
    <section className="finale-ed" id="finale">
      <div className="media-fill">
        <Image src="/hero-bg.jpg" alt="Mysore silk campaign" fill sizes="100vw" />
      </div>
      <div className="finale-ed__copy">
        <h2 className="display display--light">
          Woven
          <br />
          for
          <br />
          Generations.
        </h2>
        <p>Discover the silk of Mysuru.</p>
        <a className="btn btn--gold" href="#collection">
          Explore the Collection <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
