"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import "@/app/your-saree/build-saree.css";

const SareeCustomizer = dynamic(
  () =>
    import("@/components/build-saree/components/SareeCustomizer").then(
      (m) => m.SareeCustomizer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="studio-page" style={{ placeContent: "center", textAlign: "center" }}>
        <p
          style={{
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontSize: "0.7rem",
            color: "#b79a68",
          }}
        >
          Loading atelier…
        </p>
      </div>
    ),
  }
);

export default function YourSareeClient() {
  return (
    <>
      <Header variant="atelier" current="your-saree" />
      <SareeCustomizer />
    </>
  );
}
