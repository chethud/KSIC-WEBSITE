import Image from "next/image";

const stories = [
  { n: "01", cat: "Heritage", title: "The Story of Mysore Silk", image: "/heritage-palace.jpg" },
  { n: "02", cat: "Craft", title: "Inside the Loom", image: "/loom-craft.jpg" },
  { n: "03", cat: "Material", title: "The Art of Zari", image: "/gold-thread.jpg" },
];

export default function StoriesSection() {
  return (
    <section className="stories-ed" id="stories">
      <header className="section-head">
        <div>
          <p className="eyebrow">Journal</p>
          <h2 className="display">Stories from Mysuru</h2>
        </div>
      </header>
      <div className="stories-ed__grid">
        {stories.map((s) => (
          <article key={s.n} className="story-ed">
            <div className="story-ed__media">
              <Image src={s.image} alt={s.title} fill sizes="33vw" />
            </div>
            <div className="story-ed__copy">
              <p>
                <span>{s.n}</span> {s.cat}
              </p>
              <h3>{s.title}</h3>
              <a href="#finale" className="btn btn--text btn--on-dark">
                Read Story <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
