import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Culture — Mysore Silk Journal",
  description: "Ceremony, court, and contemporary life in silk. Culture pieces will open here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Journal"
      title="Culture"
      lead="Ceremony, court, and contemporary life in silk. Culture pieces will open here."
      current="journal"
      ctaHref="/journal"
      ctaLabel="Open the journal"
    />
  );
}
