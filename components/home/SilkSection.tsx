import Image from "next/image";

export default function SilkSection() {
  return (
    <section className="silk" id="silk">
      <div className="silk__copy">
        <p className="eyebrow eyebrow--light">Material</p>
        <h2 className="display display--light">The Silk</h2>
        <p className="silk__lead">
          Born in Mysuru.
          <br />
          Woven with precision.
          <br />
          Made to endure.
        </p>
      </div>
      <figure className="silk__visual">
        <div className="media-fill">
          <Image src="/zari-macro.jpg" alt="Macro detail of Mysore silk and zari" fill sizes="100vw" />
        </div>
        <figcaption>Pure mulberry silk · authentic zari</figcaption>
      </figure>
    </section>
  );
}
