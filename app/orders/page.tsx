import type { Metadata } from "next";
import Header from "@/components/Header";
import OrderHistory from "@/components/account/OrderHistory";
import "./orders.css";

export const metadata: Metadata = {
  title: "Order history — Mysore Silk",
  description: "Orders placed with your Mysore Silk profile.",
};

export default function OrdersPage() {
  return (
    <>
      <Header variant="atelier" />
      <OrderHistory />
    </>
  );
}
