import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "The Zari — Mysore Silk",
  description: "Silver and gold drawn into thread — the quiet glow that marks a Mysore silk border.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Mysore Silk"
      title="The Zari"
      lead="Silver and gold drawn into thread — the quiet glow that marks a Mysore silk border."
      current="mysore-silk"
      ctaHref="/heritage?chapter=4"
      ctaLabel="Read the heritage"
    />
  );
}
