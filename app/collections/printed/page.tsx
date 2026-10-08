import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Printed — Mysore Silk",
  description: "Printed silk from the house. Pieces will appear here as the edit opens.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Collections"
      title="Printed"
      lead="Printed silk from the house. Pieces will appear here as the edit opens."
      current="collections"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
