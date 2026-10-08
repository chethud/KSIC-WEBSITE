import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "The Archive — Mysore Silk",
  description: "Documents, photographs, and loom tickets from the house. The archive will open here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="The World of KSIC"
      title="The Archive"
      lead="Documents, photographs, and loom tickets from the house. The archive will open here."
      current="world"
      ctaHref="/heritage"
      ctaLabel="Our heritage"
    />
  );
}
