import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Gift Sets — Mysore Silk",
  description: "Curated silk sets for moments meant to be remembered.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Shop"
      title="Gift Sets"
      lead="Curated silk sets for moments meant to be remembered."
      current="shop"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
