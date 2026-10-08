import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Digital — Mysore Silk",
  description: "Digitally finished silk from the house. The collection will open here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Collections"
      title="Digital"
      lead="Digitally finished silk from the house. The collection will open here."
      current="collections"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
