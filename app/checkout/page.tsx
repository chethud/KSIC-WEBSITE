import type { Metadata } from "next";
import Header from "@/components/Header";
import CheckoutView from "@/components/checkout/CheckoutView";
import "./checkout.css";

export const metadata: Metadata = {
  title: "Checkout — Mysore Silk",
  description: "Review your Mysore Silk bag. Payment is available only when a gateway is connected.",
};

export default function CheckoutPage() {
  return (
    <>
      <Header variant="atelier" />
      <main className="checkout">
        <CheckoutView />
      </main>
    </>
  );
}
