"use client";

import LuxuryProductDetail from "@/components/product/LuxuryProductDetail";
import { MAHARAJA_PRODUCTS, type MaharajaProduct } from "@/lib/maharaja-products";

const RELATED_IMAGES = [
  "/pdp/emerald-silk.jpg",
  "/pdp/ivory-silk.jpg",
  "/pdp/purple-silk.jpg",
  "/pdp/peacock-silk.jpg",
];

type Props = { product: MaharajaProduct };

export default function ProductClient({ product }: Props) {
  const images = [
    { src: product.image, alt: product.name },
    { src: product.hover, alt: `${product.name} zari detail` },
    { src: "/pdp/zari-macro.jpg", alt: "Gold zari close-up" },
    { src: "/pdp/border-fold.jpg", alt: "Silk border fold" },
    { src: product.hover, alt: `${product.name} fabric` },
  ];

  const related = MAHARAJA_PRODUCTS.filter((item) => item.slug !== product.slug)
    .slice(0, 4)
    .map((item, index) => ({
      href: `/collection/${item.slug}`,
      name: item.name,
      price: item.priceLabel,
      image: RELATED_IMAGES[index] ?? item.hover,
    }));

  const details = [
    `Weave — ${product.details.weave}`,
    `Zari — ${product.details.zari}`,
    `Fabric — ${product.details.fabric}`,
    `Border — ${product.details.border}`,
    `Pallu — ${product.details.pallu}`,
    `Length — ${product.details.length}`,
    `Weight — ${product.details.weight}`,
    `Origin — ${product.details.origin}`,
    `Certification — ${product.details.certification}`,
  ].join("\n");

  return (
    <LuxuryProductDetail
      crumbs={[
        { href: "/sarees", label: "Women" },
        { href: "/sarees", label: "Sarees" },
        { label: "Heritage Collection" },
      ]}
      name={product.name}
      tagline={product.tagline}
      price={product.priceLabel}
      description={product.description}
      images={images}
      colors={MAHARAJA_PRODUCTS.map((item) => ({
        id: item.slug,
        label: item.colorName,
        hex: item.hexColor,
        href: `/collection/${item.slug}`,
      }))}
      activeColorId={product.slug}
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
