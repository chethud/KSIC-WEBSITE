import Image from "next/image";

export default function HeirloomSection() {
  return (
    <section className="heirloom" id="heirloom">
      <figure className="heirloom__media">
        <div className="media-fill">
          <Image src="/heirloom.jpg" alt="Generations connected through Mysore silk" fill sizes="55vw" />
        </div>
      </figure>
      <div className="heirloom__copy">
        <p className="eyebrow">Legacy</p>
        <h2 className="display display--light">
          Made
          <br />
          to be
          <br />
          Inherited.
        </h2>
        <p className="heirloom__lead">
          Some things are bought.
          <br />
          Some things become part of your family.
        </p>
        <a className="btn btn--ghost" href="#stories">
          Discover the Legacy <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
