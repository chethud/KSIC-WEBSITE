import type { Metadata } from "next";
import Header from "@/components/Header";
import BagView from "@/components/bag/BagView";
import "./bag.css";

export const metadata: Metadata = {
  title: "Your Bag — Mysore Silk",
  description: "Sarees waiting in your Mysore Silk bag.",
};

export default function BagPage() {
  return (
    <>
      <Header variant="atelier" />
      <BagView />
    </>
  );
}
