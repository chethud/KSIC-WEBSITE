import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Our Story — Mysore Silk",
  description: "The heritage, silk, and craft of KSIC Mysore Silk.",
};

const chapters = [
  { href: "/heritage", title: "Our heritage", copy: "Seven chapters, from the royal commission of 1912 to the living loom." },
  { href: "/heritage?chapter=2", title: "Story of Mysore silk", copy: "Why the filament is chosen before it ever meets the loom." },
  { href: "/heritage?chapter=3", title: "Weaving and artisans", copy: "The hands that set tension and place the zari." },
  { href: "/#silk", title: "Craftsmanship", copy: "The silk film on the homepage, beside the loom." },
  { href: "/care", title: "Silk care", copy: "How a finished saree is washed, aired, folded, and stored." },
];

export default function StoryPage() {
  return (
    <>
      <Header variant="atelier" current="story" />
      <main className="ux">
        <div className="ux__inner">
          <p className="ux-kicker">Our story</p>
          <h1>A house, not a catalogue introduction.</h1>
          <p className="ux__lead">
            Read the heritage on its own. When you are ready, the collection is a separate step. Showroom addresses are not listed here until KSIC publishes a verified list.
          </p>
          <div className="ux-grid">
            {chapters.map((item) => (
              <Link key={item.title} href={item.href} className="ux-card">
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
                <span>Discover the story</span>
              </Link>
            ))}
          </div>
          <div className="ux-actions">
            <Link href="/sarees" className="ux-btn ux-btn--gold">Discover the collection</Link>
          </div>
        </div>
      </main>
    </>
  );
}
