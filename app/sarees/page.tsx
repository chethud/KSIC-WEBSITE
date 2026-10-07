import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import SareeCollection from "@/components/sarees/SareeCollection";

export const metadata: Metadata = {
  title: "Sarees Beyond Time — Women's Collection | Mysore Silk",
  description:
    "Handwoven Mysore silk sarees — pure silk, zari, temple borders, bridal and contemporary edits.",
};

export default function SareesPage() {
  return (
    <>
      <Header variant="atelier" current="sarees" />
      <main>
        <Suspense fallback={<p className="ux-empty">Opening the collection…</p>}>
          <SareeCollection />
        </Suspense>
      </main>
    </>
  );
}
