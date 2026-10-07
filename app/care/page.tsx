import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { CARE_NOTES } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Silk Care — Mysore Silk",
  description: "How to wash, dry, iron, fold, and store a Mysore silk saree.",
};

export default function CarePage() {
  return (
    <>
      <Header variant="atelier" current="story" />
      <main className="ux">
        <div className="ux__inner">
          <p className="ux-kicker">Silk care</p>
          <h1>Keep the sheen.</h1>
          <p className="ux__lead">The same care notes shown on each product page. A purchased saree will repeat them inside My Wardrobe once an order can be completed.</p>
          <div className="ux-grid">
            {CARE_NOTES.map((note) => (
              <article key={note.title} className="ux-card">
                <h2>{note.title}</h2>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
          <div className="ux-actions">
            <Link href="/sarees" className="ux-btn ux-btn--line">Discover the collection</Link>
          </div>
        </div>
      </main>
    </>
  );
}
