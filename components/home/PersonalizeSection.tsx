import Image from "next/image";
import Link from "next/link";

export default function PersonalizeSection() {
  return (
    <section className="personalize-ed" id="personalize">
      <div className="personalize-ed__copy">
        <p className="eyebrow">Atelier</p>
        <h2 className="display">
          Your Saree.
          <br />
          Your Story.
        </h2>
        <p className="body">
          Colour, zari, border, weave and motif — configure a Mysore silk heirloom in our digital
          atelier, inspired by the precision of a luxury configurator.
        </p>
        <ul className="meta">
          <li>Colour</li>
          <li>Zari</li>
          <li>Border</li>
          <li>Pallu</li>
          <li>Motifs</li>
        </ul>
        <Link href="/your-saree" className="btn btn--solid">
          Create Your Saree <span aria-hidden="true">→</span>
        </Link>
      </div>
      <figure className="personalize-ed__media">
        <div className="media-fill">
          <Image src="/indian-saree-1.jpg" alt="Personalize your Mysore silk saree" fill sizes="50vw" />
        </div>
      </figure>
    </section>
  );
}
