import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Men's — Mysore Silk",
  description: "Silk for men — shirts, kurtas, and ties from the house. Coming to this shelf.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Collections"
      title="Men's"
      lead="Silk for men — shirts, kurtas, and ties from the house. Coming to this shelf."
      current="collections"
      ctaHref="/collections"
      ctaLabel="View collections"
    />
  );
}
