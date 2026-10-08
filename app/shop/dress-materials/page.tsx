import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Dress Materials — Mysore Silk",
  description: "Fine Mysore silk lengths for contemporary cuts and atelier makes.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Shop"
      title="Dress Materials"
      lead="Fine Mysore silk lengths for contemporary cuts and atelier makes."
      current="shop"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
