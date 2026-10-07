import type { Metadata } from "next";
import Header from "@/components/Header";
import WishlistView from "@/components/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist — Mysore Silk",
  description: "Sarees you are considering from the Mysore Silk collection.",
};

export default function WishlistPage() {
  return (
    <>
      <Header variant="atelier" />
      <main className="ux">
        <WishlistView />
      </main>
    </>
  );
}
