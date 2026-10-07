import type { Metadata } from "next";
import { Suspense } from "react";
import YourSareeClient from "./YourSareeClient";

export const metadata: Metadata = {
  title: "Build Your Own Saree — KSIC Atelier | Mysore Silk",
  description:
    "Design your own Mysore silk saree in 3D — colour, border, pallu, zari and finish.",
};

export default function YourSareePage() {
  return (
    <Suspense fallback={null}>
      <YourSareeClient />
    </Suspense>
  );
}
