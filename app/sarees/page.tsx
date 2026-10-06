import type { Metadata } from "next";
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
        <SareeCollection />
      </main>
    </>
  );
}
