import Image from "next/image";
import Link from "next/link";

const occasions = [
  {
    title: "Sarees",
    copy: "Mysore silk,\nwoven for every occasion.",
    image: "/cat-sarees.jpg?v=2",
    alt: "Woman wearing a Mysore silk saree",
    href: "/sarees",
    face: true,
  },
  {
    title: "Men's",
    copy: "Silk shirts, kurtas,\nand ties from the house.",
    image: "/cat-mens.jpg",
    alt: "Man in a maroon Mysore silk kurta with gold zari",
    href: "/collections/mens",
    face: true,
  },
  {
    title: "Gifts",
    copy: "Silk to give,\nand to keep.",
    image: "/journal/journal-vault.jpg",
    alt: "A rosewood chest of folded Mysore silk sarees",
    href: "/collections/gifts",
  },
];

export default function Categories() {
  return (
    <section className="categories" id="categories" aria-label="Shop by collection">
      {occasions.map((cat) => (
        <Link key={cat.title} className={cat.face ? "cat cat--face" : "cat"} href={cat.href}>
          <div className="media-fill">
            <Image src={cat.image} alt={cat.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
          </div>
          <div className="cat__copy">
            <h3>{cat.title}</h3>
            <p>
              {cat.copy.split("\n").map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <span className="cat__cta">
              Explore collection <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
