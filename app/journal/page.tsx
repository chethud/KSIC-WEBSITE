import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { JOURNAL } from "@/lib/journal";
import "./journal.css";

export const metadata: Metadata = {
  title: "Journal — Mysore Silk",
  description: "Heritage and craft stories from the Mysore Silk house.",
};

export default function JournalPage() {
  const [lead, ...stories] = JOURNAL;

  return (
    <>
      <Header variant="atelier" current="journal" />
      <main className="journal">
        <section className="journal__hero" aria-label="Journal">
          <Image
            src="/heritage/05-wide.jpg?v=5"
            alt="Mysore silk worn for a palace ceremony"
            fill
            priority
            sizes="100vw"
          />
          <div className="journal__hero-shade" aria-hidden="true" />
          <div className="journal__hero-copy">
            <p className="journal__kicker">Mysore Silk</p>
            <h1>Journal</h1>
            <p>Seven chapters, from a royal commission in 1912 to the loom still working in Mysuru.</p>
          </div>
        </section>

        <section className="journal__list" aria-label="Stories">
          <Link href={lead.href} className="journal__lead">
            <Image src={lead.image} alt="" fill sizes="100vw" />
            <div className="journal__shade" aria-hidden="true" />
            <div className="journal__copy">
              <p className="journal__meta">{lead.category} · {lead.date}</p>
              <h2>{lead.title}</h2>
              <p>{lead.summary}</p>
            </div>
          </Link>

          <div className="journal__grid">
            {stories.map((story) => (
              <Link key={story.n} href={story.href} className="journal__card">
                <Image src={story.image} alt="" fill sizes="(max-width: 799px) 100vw, 33vw" />
                <div className="journal__shade" aria-hidden="true" />
                <div className="journal__copy">
                  <p className="journal__meta">{story.n} · {story.category}</p>
                  <h2>{story.title}</h2>
                  <p>{story.summary}</p>
                </div>
              </Link>
            ))}
          </div>

          <nav className="journal__aside" aria-label="Continue">
            <Link href="/heritage">Open the heritage journey</Link>
            <Link href="/collections">Explore collections</Link>
            <Link href="/care">Learn how to care</Link>
          </nav>
        </section>
      </main>
    </>
  );
}
