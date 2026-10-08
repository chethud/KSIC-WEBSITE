import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "The Craft — Mysore Silk",
  description: "How the loom is dressed, the border set, and the pallu finished — a page for the craft of Mysore silk.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Mysore Silk"
      title="The Craft"
      lead="How the loom is dressed, the border set, and the pallu finished — a page for the craft of Mysore silk."
      current="mysore-silk"
      ctaHref="/heritage?chapter=3"
      ctaLabel="Read the heritage"
    />
  );
}
