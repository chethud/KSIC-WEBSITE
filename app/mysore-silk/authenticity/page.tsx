import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Authenticity — Mysore Silk",
  description: "Each KSIC Mysore silk saree carries marks of origin. This page will hold the full authenticity story.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Mysore Silk"
      title="Authenticity"
      lead="Each KSIC Mysore silk saree carries marks of origin. This page will hold the full authenticity story."
      current="mysore-silk"
      ctaHref="/sarees"
      ctaLabel="Discover the collection"
    />
  );
}
