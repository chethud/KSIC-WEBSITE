import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Exclusive Designs — Mysore Silk",
  description: "Limited atelier pieces woven in small, careful runs.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Shop"
      title="Exclusive Designs"
      lead="Limited atelier pieces woven in small, careful runs."
      current="shop"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
