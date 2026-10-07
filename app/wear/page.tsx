import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Learn the Art of the Saree — Mysore Silk",
  description: "How the house drape of a Mysore silk saree is worn.",
};

const steps = [
  { title: "The length", body: "The catalog sarees are woven at 5.5 metres, with a 0.8 metre blouse piece. That is the length the house cuts." },
  { title: "The pleats", body: "Even pleats sit at the front. The temple or gold border stays visible along the hem rather than folding inward." },
  { title: "The pallu", body: "The pallu carries the denser zari. Bring it over the shoulder so the ornamented end is the part that shows." },
  { title: "The border", body: "Keep the border line level. A dropped border is the usual mistake, not the drape itself." },
  { title: "After wearing", body: "Air the saree before it is folded. Care notes live on the silk care page." },
];

export default function WearPage() {
  return (
    <>
      <Header variant="atelier" />
      <main className="ux">
        <div className="ux__inner">
          <p className="ux-kicker">How to wear</p>
          <h1>Learn the art of the saree.</h1>
          <p className="ux__lead">
            The 3D studio shows the house drape on the model. Nivi, regional, and contemporary drape switches are not offered, because the model does not change drape.
          </p>
          <ol className="ux-grid">
            {steps.map((step, index) => (
              <li key={step.title} className="ux-card">
                <p className="ux-kicker">{String(index + 1).padStart(2, "0")}</p>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="ux-actions">
            <Link href="/your-saree" className="ux-btn ux-btn--gold">Try this silk in 3D</Link>
            <Link href="/care" className="ux-btn ux-btn--line">Learn how to care</Link>
          </div>
        </div>
      </main>
    </>
  );
}
