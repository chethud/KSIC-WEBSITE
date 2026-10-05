import Image from "next/image";

export default function HeritageBanner() {
  return (
    <section className="heritage-banner" id="heritage">
      <div className="media-fill">
        <Image src="/heritage-palace.jpg" alt="Mysuru heritage architecture" fill sizes="100vw" />
      </div>
      <div className="heritage-banner__copy">
        <h2 className="display display--light">
          A City.
          <br />
          A Craft.
          <br />
          A Legacy.
        </h2>
        <p>
          For generations, Mysuru has been home to a tradition of silk unlike any other.
        </p>
        <a className="btn btn--ghost" href="#craftsmanship">
          Discover Our Heritage <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
