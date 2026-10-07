import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { MAHARAJA_PRODUCTS } from "@/lib/maharaja-products";
import { SAREES, type SareeCategory } from "@/lib/saree-catalog";
import "./collections.css";

export const metadata: Metadata = {
  title: "Collections — Mysore Silk",
  description: "The Maharaja Collection and the occasion edits of Mysore Silk.",
};

const edits: {
  href: string;
  title: string;
  copy: string;
  image: string;
  alt: string;
  category: SareeCategory;
  lead?: boolean;
}[] = [
  {
    href: "/sarees?category=bridal",
    title: "Bridal",
    copy: "Wedding red, dense with heritage gold zari.",
    image: "/sarees/bridal-red.jpg",
    alt: "Bridal red Mysore silk saree",
    category: "bridal",
    lead: true,
  },
  {
    href: "/sarees?category=temple",
    title: "Ceremonial",
    copy: "Temple borders for rites that ask for gold.",
    image: "/sarees/emerald.jpg",
    alt: "Emerald Mysore silk with a temple border",
    category: "temple",
  },
  {
    href: "/sarees?category=traditional",
    title: "Festive",
    copy: "Traditional weaves for the festival calendar.",
    image: "/sarees/royal-white.jpg",
    alt: "Ivory Mysore silk with a grand gold border",
    category: "traditional",
  },
  {
    href: "/sarees?category=pastel",
    title: "Everyday luxury",
    copy: "Pastel silk for days that still want a sheen.",
    image: "/sarees/blush.jpg",
    alt: "Soft blush Mysore silk saree",
    category: "pastel",
  },
  {
    href: "/sarees?category=contemporary",
    title: "Contemporary",
    copy: "Jewel tones finished with a finer zari line.",
    image: "/sarees/royal-blue.jpg",
    alt: "Royal blue Mysore silk saree",
    category: "contemporary",
  },
  {
    href: "/sarees",
    title: "All sarees",
    copy: "The full women's collection from the Mysuru looms.",
    image: "/sarees/classic-white.jpg",
    alt: "Classic white Mysore silk saree",
    category: "all",
  },
];

function countFor(category: SareeCategory) {
  if (category === "all") return SAREES.length;
  return SAREES.filter((saree) => saree.categories.includes(category)).length;
}

export default function CollectionsPage() {
  return (
    <>
      <Header variant="atelier" current="collections" />
      <main className="cols">
        <section className="cols__hero" aria-label="Collections">
          <Image
            src="/sarees/hero.jpg"
            alt="Woman in a Mysore silk saree before palace architecture"
            fill
            priority
            sizes="100vw"
          />
          <div className="cols__hero-shade" aria-hidden="true" />
          <div className="cols__hero-copy">
            <p className="cols__kicker">Mysore Silk</p>
            <h1>Collections</h1>
            <p>Palace sarees from the Maharaja edit, and the house colours woven for bridal, ceremony, and the quieter days between.</p>
          </div>
        </section>

        <section className="cols__feature" aria-labelledby="maharaja-title">
          <header className="cols__head">
            <div>
              <p className="cols__kicker">Heritage collection</p>
              <h2 id="maharaja-title">The Maharaja Collection</h2>
            </div>
            <p className="cols__note">{MAHARAJA_PRODUCTS.length} sarees, each photographed as it was woven.</p>
          </header>
          <ul className="cols__rail">
            {MAHARAJA_PRODUCTS.map((item) => (
              <li key={item.slug}>
                <Link href={`/collection/${item.slug}`} className="cols__piece">
                  <figure>
                    <Image src={item.image} alt={item.name} fill sizes="(max-width: 799px) 50vw, 18vw" />
                  </figure>
                  <h3>{item.name}</h3>
                  <p>{item.code}</p>
                  <span>{item.priceLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="cols__edits" aria-labelledby="edits-title">
          <header className="cols__head">
            <div>
              <p className="cols__kicker">Shop by occasion</p>
              <h2 id="edits-title">The house edits</h2>
            </div>
            <Link href="/sarees" className="cols__link">View all sarees</Link>
          </header>
          <div className="cols__mosaic">
            {edits.map((edit) => {
              const count = countFor(edit.category);
              const pieces = count === 1 ? "1 saree" : `${count} sarees`;
              return (
                <Link
                  key={edit.href}
                  href={edit.href}
                  className={edit.lead ? "cols__edit cols__edit--lead" : "cols__edit"}
                >
                  <Image src={edit.image} alt={edit.alt} fill sizes={edit.lead ? "50vw" : "30vw"} />
                  <div className="cols__edit-shade" aria-hidden="true" />
                  <div className="cols__edit-copy">
                    <p>{pieces}</p>
                    <h3>{edit.title}</h3>
                    <span>{edit.copy}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
