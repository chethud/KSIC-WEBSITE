import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SareeDetail from "@/components/sarees/SareeDetail";
import { getSaree, getSareeIds } from "@/lib/saree-catalog";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getSareeIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const saree = getSaree(id);
  if (!saree) return { title: "Saree — Mysore Silk" };
  return {
    title: `${saree.name} | Mysore Silk`,
    description: saree.story,
  };
}

export default async function SareeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const saree = getSaree(id);
  if (!saree) notFound();

  return (
    <>
      <Header variant="atelier" current="sarees" />
      <main className="pdp-page">
        <SareeDetail saree={saree} />
      </main>
    </>
  );
}
