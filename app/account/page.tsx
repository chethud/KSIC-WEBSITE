import type { Metadata } from "next";
import Header from "@/components/Header";
import AccountView from "@/components/account/AccountView";
import "./account.css";

export const metadata: Metadata = {
  title: "Your Profile — Mysore Silk",
  description: "Your Mysore Silk profile details.",
};

export default function AccountPage() {
  return (
    <>
      <Header variant="atelier" />
      <AccountView />
    </>
  );
}
