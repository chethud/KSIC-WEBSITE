import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Craft — Mysore Silk Journal",
  description: "Notes on loom, zari, and finish. Craft chapters from the journal will live here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Journal"
      title="Craft"
      lead="Notes on loom, zari, and finish. Craft chapters from the journal will live here."
      current="journal"
      ctaHref="/journal"
      ctaLabel="Open the journal"
    />
  );
}
