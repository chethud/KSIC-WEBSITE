import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Crepe — Mysore Silk",
  description: "A lighter hand of Mysore silk. The full crepe edit will live here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Collections"
      title="Crepe"
      lead="A lighter hand of Mysore silk. The full crepe edit will live here."
      current="collections"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
