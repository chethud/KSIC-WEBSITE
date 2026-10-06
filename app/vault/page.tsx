import type { Metadata } from "next";
import Header from "@/components/Header";
import VaultClient from "./VaultClient";
import "./vault.css";

export const metadata: Metadata = {
  title: "My Vault — Virtual Closet | Mysore Silk",
  description:
    "Your KSIC virtual closet — browse owned heirloom sarees and liked pieces in interactive 3D.",
};

export default function VaultPage() {
  return (
    <>
      <Header variant="atelier" />
      <VaultClient />
    </>
  );
}
