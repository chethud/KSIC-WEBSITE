import Image from "next/image";
import Link from "next/link";

const closeGates = [
  {
    href: "/journal",
    kicker: "Journal",
    title: "Read the loom's story",
    copy: "Heritage chapters, read on their own. A story never drops a saree into the bag.",
    cta: "Read story",
    image: "/journal/journal-loom.jpg?v=2",
    alt: "An artisan weaving maroon Mysore silk with gold zari",
  },
  {
    href: "/wear",
    kicker: "How to wear",
    title: "Learn the art of the saree",
    copy: "The house drape, the length on the loom ticket, and what the studio can show.",
    cta: "Read the guide",
    image: "/journal/journal-wear.jpg",
    alt: "A woman in an ivory Mysore silk saree with a gold zari border",
    face: true,
  },
  {
    href: "/account",
    kicker: "Silk Vault",
    title: "Where a saree lives after you buy it",
    copy: "Wishlist, saved creations, and — once an order can be completed — your wardrobe.",
    cta: "Open my wardrobe",
    image: "/journal/journal-vault.jpg",
    alt: "A rosewood chest of folded Mysore silk sarees",
  },
] as const;

export function CloseBand() {
  return (
    <section className="home-band" aria-label="Journal, how to wear, and Silk Vault">
      <div className="home-band__inner">
        {closeGates.map((gate) => (
          <Link key={gate.href} href={gate.href} className={"face" in gate ? "home-gate home-gate--face" : "home-gate"}>
            <div className="home-gate__media">
              <Image src={gate.image} alt={gate.alt} fill sizes="(max-width: 799px) 100vw, 33vw" />
            </div>
            <div className="home-gate__copy">
              <em>{gate.kicker}</em>
              <strong>{gate.title}</strong>
              <p>{gate.copy}</p>
              <span>
                {gate.cta}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
