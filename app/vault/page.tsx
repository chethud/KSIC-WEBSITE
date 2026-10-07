import type { Metadata } from "next";
import Header from "@/components/Header";
import VaultClient from "./VaultClient";
import "./vault.css";

export const metadata: Metadata = {
  title: "Studio closet — Mysore Silk",
  description:
    "Explore house silks in 3D. Purchased sarees live in Silk Vault only after an order is completed.",
};

export default function VaultPage() {
  return (
    <>
      <Header variant="atelier" />
      <VaultClient />
    </>
  );
}
