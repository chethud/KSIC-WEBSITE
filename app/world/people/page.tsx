import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Our People — Mysore Silk",
  description: "The hands that set tension and place the zari. Stories of the house will gather here.",
};

export default function Page() {
  return (
    <StubPage
      kicker="The World of KSIC"
      title="Our People"
      lead="The hands that set tension and place the zari. Stories of the house will gather here."
      current="world"
      ctaHref="/heritage?chapter=3"
      ctaLabel="Read the heritage"
    />
  );
}
