import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Showrooms — Mysore Silk",
  description: "KSIC showrooms across Karnataka and beyond. A verified list will be published here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Visit"
      title="Showrooms"
      lead="KSIC showrooms across Karnataka and beyond. A verified list will be published here."
      current="visit"
      ctaHref="/visit/store-locator"
      ctaLabel="Store locator"
    />
  );
}
