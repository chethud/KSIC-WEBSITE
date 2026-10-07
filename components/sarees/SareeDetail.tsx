"use client";

import { useMemo, useState } from "react";
import LuxuryProductDetail from "@/components/product/LuxuryProductDetail";
import { SAREES, type SareeProduct } from "@/lib/saree-catalog";

type Props = { saree: SareeProduct };

export default function SareeDetail({ saree }: Props) {
  const [swatchId, setSwatchId] = useState(saree.swatches[0]?.id ?? "");
  const swatch = saree.swatches.find((item) => item.id === swatchId) ?? saree.swatches[0];
  const hero = swatch?.image ?? saree.image;

  const images = useMemo(
    () => [
      { src: hero, alt: saree.name },
      { src: saree.fabric, alt: `${saree.name} fabric` },
      { src: "/pdp/zari-macro.jpg", alt: "Gold zari close-up" },
      { src: "/pdp/border-fold.jpg", alt: "Silk border fold" },
      { src: saree.fabric, alt: `${saree.name} weave` },
    ],
    [hero, saree.fabric, saree.name]
  );

  const related = SAREES.filter((item) => item.id !== saree.id)
    .slice(0, 4)
    .map((item) => ({
      href: `/sarees/${item.id}`,
      name: item.name,
      price: `₹ ${item.price.toLocaleString("en-IN")}`,
      image: item.fabric,
    }));

  const details = [
    `Weave — ${saree.details.weave}`,
    `Zari — ${saree.details.zari}`,
    `Fabric — ${saree.details.fabric}`,
    `Border — ${saree.details.border}`,
    `Pallu — ${saree.details.pallu}`,
    `Blouse — ${saree.details.blouse}`,
    `Length — ${saree.details.length}`,
    `Weight — ${saree.details.weight}`,
    `Origin — ${saree.details.origin}`,
    `Certification — ${saree.details.certification}`,
  ].join("\n");

  return (
    <LuxuryProductDetail
      crumbs={[
        { href: "/sarees", label: "Women" },
        { href: "/sarees", label: "Sarees" },
        { label: "Heritage Collection" },
      ]}
      name={saree.name}
      tagline={saree.description}
      price={`₹ ${saree.price.toLocaleString("en-IN")}`}
      priceAmount={saree.price}
      productId={saree.id}
      productHref={`/sarees/${saree.id}`}
      description={saree.story}
      images={images}
      colors={saree.swatches.map((item) => ({
        id: item.id,
        label: item.label,
        hex: item.hex,
      }))}
      activeColorId={swatch?.id ?? ""}
      onColor={setSwatchId}
      accordions={[
        { id: "details", title: "Product details", body: details },
        {
          id: "care",
          title: "Care instructions",
          body: "Dry clean only. Store folded in muslin, away from direct sun. Air the saree before returning it to the wardrobe. Keep zari from moisture and perfume.",
        },
        {
          id: "shipping",
          title: "Shipping & returns",
          body: "Complimentary shipping across India. Easy returns within 7 days of delivery if the saree is unused, with its Silk Mark tag intact.",
        },
      ]}
      related={related}
    />
  );
}
