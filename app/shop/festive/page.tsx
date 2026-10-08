import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Festive Collection — Mysore Silk",
  description: "Colour and zari for festivals, gatherings, and bright evenings.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Shop"
      title="Festive Collection"
      lead="Colour and zari for festivals, gatherings, and bright evenings."
      current="shop"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
