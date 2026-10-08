import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "New Arrivals — Mysore Silk",
  description: "The newest silk from the loom. Fresh pieces will appear on this shelf.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Shop"
      title="New Arrivals"
      lead="The newest silk from the loom. Fresh pieces will appear on this shelf."
      current="shop"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
