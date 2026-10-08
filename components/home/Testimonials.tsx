const voices = [
  {
    quote:
      "The silk arrived with the quiet weight of something made to last. My mother recognised the sheen before she read the ticket.",
    name: "Ananya R.",
    place: "Bengaluru",
    note: "Heirloom gift",
  },
  {
    quote:
      "For our wedding, we wanted temple borders without noise. The ceremonial piece carried the day — and will carry the next generation.",
    name: "Meera & Karthik",
    place: "Mysuru",
    note: "Wedding",
  },
  {
    quote:
      "I ordered a kurta for my father. The zari is soft, not loud — exactly how Mysore silk should feel against the skin.",
    name: "Rohan S.",
    place: "Hyderabad",
    note: "Men's silk",
  },
] as const;

export default function Testimonials() {
  return (
    <section className="voices" aria-label="Customer voices">
      <div className="voices__inner">
        <header className="voices__head">
          <p className="voices__kicker">Speaking from their hearts</p>
          <h2>Stories woven into every saree</h2>
        </header>

        <ul className="voices__grid">
          {voices.map((voice) => (
            <li key={voice.name}>
              <blockquote className="voices__quote">
                <div className="voices__stars" aria-hidden="true">
                  <span /><span /><span /><span /><span />
                </div>
                <p>“{voice.quote}”</p>
                <footer>
                  <strong>{voice.name}</strong>
                  <span>
                    {voice.place} · {voice.note}
                  </span>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
