import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Dupattas & Stoles — Mysore Silk",
  description: "Light silk accents with zari that catches the evening light.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Shop"
      title="Dupattas & Stoles"
      lead="Light silk accents with zari that catches the evening light."
      current="shop"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
