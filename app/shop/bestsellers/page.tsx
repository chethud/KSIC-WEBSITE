import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Bestsellers — Mysore Silk",
  description: "The house's most sought-after silk. Bestsellers will be curated here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Shop"
      title="Bestsellers"
      lead="The house's most sought-after silk. Bestsellers will be curated here."
      current="shop"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
