import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Store Locator — Mysore Silk",
  description: "Find a KSIC showroom near you. The locator will open here when addresses are verified.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Visit"
      title="Store Locator"
      lead="Find a KSIC showroom near you. The locator will open here when addresses are verified."
      current="visit"
      ctaHref="/visit/showrooms"
      ctaLabel="Showrooms"
    />
  );
}
