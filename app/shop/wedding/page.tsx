import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Wedding Collection — Mysore Silk",
  description: "Ceremonial Mysore silk for bridal mornings and temple rites.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Shop"
      title="Wedding Collection"
      lead="Ceremonial Mysore silk for bridal mornings and temple rites."
      current="shop"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
