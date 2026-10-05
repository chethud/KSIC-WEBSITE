import Image from "next/image";

const items = [
  { name: "The Vermilion", copy: "For ceremonial light.", image: "/hero-campaign.jpg" },
  { name: "Mysore Ivory", copy: "Quiet radiance.", image: "/silk-threads.jpg" },
  { name: "Antique Gold", copy: "Zari as jewellery.", image: "/zari-macro.jpg" },
];

export default function SignatureSection() {
  return (
    <section className="signature-ed" id="signature">
      <header className="section-head section-head--center">
        <p className="eyebrow">Signature</p>
        <h2 className="display">Signature Sarees</h2>
        <p className="section-lead">Pieces destined to become heirlooms.</p>
      </header>
      <div className="signature-ed__grid">
        {items.map((item) => (
          <article key={item.name} className="sig-card">
            <div className="sig-card__media">
              <Image src={item.image} alt={item.name} fill sizes="33vw" />
            </div>
            <h3>{item.name}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
