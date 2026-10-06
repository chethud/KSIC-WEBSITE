import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import {
  getMaharajaProduct,
  getMaharajaSlugs,
} from "@/lib/maharaja-products";
import ProductClient from "./ProductClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getMaharajaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getMaharajaProduct(slug);
  if (!product) return { title: "Saree — Mysore Silk" };
  return {
    title: `${product.name} — Maharaja Collection | Mysore Silk`,
    description: product.description,
  };
}

export default async function MaharajaProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getMaharajaProduct(slug);
  if (!product) notFound();

  return (
    <>
      <Header variant="atelier" />
      <main className="pdp-page">
        <ProductClient product={product} />
      </main>
    </>
  );
}
