import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Gifts — Mysore Silk",
  description: "Silk gifts from the house. A curated selection will live on this page.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Collections"
      title="Gifts"
      lead="Silk gifts from the house. A curated selection will live on this page."
      current="collections"
      ctaHref="/collections"
      ctaLabel="View collections"
    />
  );
}
