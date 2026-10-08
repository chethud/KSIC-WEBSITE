import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Stories — Mysore Silk Journal",
  description: "People, places, and moments behind Mysore silk. Editorial stories will gather here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Journal"
      title="Stories"
      lead="People, places, and moments behind Mysore silk. Editorial stories will gather here."
      current="journal"
      ctaHref="/journal"
      ctaLabel="Open the journal"
    />
  );
}
