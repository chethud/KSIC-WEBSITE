import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "The Factory — Mysore Silk",
  description: "The Mysuru weaving factory — where the loom still answers a royal commission.",
};

export default function Page() {
  return (
    <StubPage
      kicker="The World of KSIC"
      title="The Factory"
      lead="The Mysuru weaving factory — where the loom still answers a royal commission."
      current="world"
      ctaHref="/heritage"
      ctaLabel="Our heritage"
    />
  );
}
