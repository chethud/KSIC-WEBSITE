import type { Metadata } from "next";
import StubPage from "@/components/site/StubPage";

export const metadata: Metadata = {
  title: "Fabric by Meter — Mysore Silk",
  description: "Loom-fresh silk by the meter for houses that sew their own story.",
};

export default function Page() {
  return (
    <StubPage
      kicker="Shop"
      title="Fabric by Meter"
      lead="Loom-fresh silk by the meter for houses that sew their own story."
      current="shop"
      ctaHref="/sarees"
      ctaLabel="Browse sarees"
    />
  );
}
