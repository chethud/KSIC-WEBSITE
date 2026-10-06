"use client";

import dynamic from "next/dynamic";

const VirtualCloset = dynamic(
  () => import("@/components/vault/VirtualCloset").then((m) => m.VirtualCloset),
  {
    ssr: false,
    loading: () => (
      <div className="closet-app closet-app--standalone" style={{ display: "grid", placeItems: "center" }}>
        <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.72rem", color: "#8E8074" }}>
          Opening your vault…
        </p>
      </div>
    ),
  }
);

export default function VaultClient() {
  return <VirtualCloset embedded />;
}
