import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "The Silk — Mysore Silk",
  description: "Pure filament, chosen for lustre and strength before it ever meets the loom.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Mysore Silk"
      title="The Silk"
      lead="Pure filament, chosen for lustre and strength before it ever meets the loom."
      current="mysore-silk"
      ctaHref="/heritage?chapter=2"
      ctaLabel="Read the heritage"
    />
  );
}
