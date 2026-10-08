import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Factory Visit — Mysore Silk",
  description: "Visit the Mysuru weaving factory. Visiting hours and guidance will be listed here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Visit"
      title="Factory"
      lead="Visit the Mysuru weaving factory. Visiting hours and guidance will be listed here."
      current="visit"
      ctaHref="/world/factory"
      ctaLabel="About the factory"
    />
  );
}
