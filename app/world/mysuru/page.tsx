import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Mysuru — Mysore Silk",
  description: "The city that gave the silk its name. A guide to Mysuru and the house will live here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="The World of KSIC"
      title="Mysuru"
      lead="The city that gave the silk its name. A guide to Mysuru and the house will live here."
      current="world"
      ctaHref="/heritage"
      ctaLabel="Our heritage"
    />
  );
}
