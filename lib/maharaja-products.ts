export type MaharajaProduct = {
  slug: string;
  code: string;
  name: string;
  price: number;
  priceLabel: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  hover: string;
  colorName: string;
  hexColor: string;
  details: {
    weave: string;
    zari: string;
    fabric: string;
    origin: string;
    length: string;
    weight: string;
    certification: string;
    border: string;
    pallu: string;
  };
};

export const MAHARAJA_PRODUCTS: MaharajaProduct[] = [
  {
    slug: "royal-blue",
    code: "MS-001",
    name: "The Royal Blue",
    price: 128000,
    priceLabel: "₹ 1,28,000",
    category: "Maharaja Collection",
    tagline: "Deep sapphire silk with temple gold zari.",
    description:
      "A regal Mysore silk in royal blue, woven with pure gold zari that catches light along the border and pallu. Commissioned in the spirit of palace attire — luminous, weighty in presence, and made to be inherited.",
    image: "/maharaja/royal-blue.jpg?v=1",
    hover: "/maharaja/royal-blue-hover.jpg?v=1",
    colorName: "Royal Blue & Gold",
    hexColor: "#1a3a6b",
    details: {
      weave: "Traditional Mysore handloom satin weave",
      zari: "Pure gold zari (temple border & pallu)",
      fabric: "100% pure mulberry silk",
      origin: "Mysore Silk Weaving Factory, Karnataka",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "640 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Classic temple border in gold zari",
      pallu: "Rich brocade pallu with floral motifs",
    },
  },
  {
    slug: "vermilion",
    code: "MS-002",
    name: "The Vermilion",
    price: 142000,
    priceLabel: "₹ 1,42,000",
    category: "Maharaja Collection",
    tagline: "Ceremonial red silk for grand occasions.",
    description:
      "Vermilion silk steeped in auspicious tradition — a bridal and ceremonial favourite. The zari work is dense along the pallu, giving the drape a luminous edge against the deep red body.",
    image: "/maharaja/vermilion.jpg?v=1",
    hover: "/maharaja/vermilion-hover.jpg?v=1",
    colorName: "Vermilion & Antique Gold",
    hexColor: "#9b1b1e",
    details: {
      weave: "Heavy bridal Mysore silk weave",
      zari: "Antique gold zari with silver core",
      fabric: "100% pure mulberry silk",
      origin: "KSIC Heritage Looms, Mysuru",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "680 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Wide ceremonial gold border",
      pallu: "Ornate peacock and floral pallu",
    },
  },
  {
    slug: "mysore-ivory",
    code: "MS-003",
    name: "The Mysore Ivory",
    price: 118000,
    priceLabel: "₹ 1,18,000",
    category: "Maharaja Collection",
    tagline: "Soft ivory silk with champagne zari.",
    description:
      "An ivory Mysore silk with a quiet sheen — elegant for day ceremonies and evening gatherings alike. Champagne-toned zari keeps the look refined without losing royal presence.",
    image: "/maharaja/ivory.jpg?v=1",
    hover: "/maharaja/ivory-hover.jpg?v=1",
    colorName: "Mysore Ivory & Champagne",
    hexColor: "#e8dfd0",
    details: {
      weave: "Fine Mysore crepe-satin weave",
      zari: "Champagne gold zari",
      fabric: "100% pure mulberry silk",
      origin: "Mysore Silk Weaving Factory, Karnataka",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "560 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Delicate contrast gold border",
      pallu: "Soft brocade ivory-gold pallu",
    },
  },
  {
    slug: "palace-green",
    code: "MS-004",
    name: "The Palace Green",
    price: 136000,
    priceLabel: "₹ 1,36,000",
    category: "Maharaja Collection",
    tagline: "Emerald silk inspired by palace gardens.",
    description:
      "Palace green silk with a deep jewel tone and gold zari that recalls Mysuru’s gardens at dusk. A distinctive colour for those who favour heritage with a bolder presence.",
    image: "/maharaja/palace-green.jpg?v=1",
    hover: "/maharaja/palace-green-hover.jpg?v=1",
    colorName: "Palace Emerald & Gold",
    hexColor: "#1b4d3e",
    details: {
      weave: "Traditional Korvai-inspired Mysore weave",
      zari: "Pure gold zari peacock motifs",
      fabric: "100% pure mulberry silk",
      origin: "Heritage Looms of Mysuru",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "620 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Temple border with peacock accents",
      pallu: "Garden motif brocade pallu",
    },
  },
  {
    slug: "maharani",
    code: "MS-005",
    name: "The Maharani",
    price: 184000,
    priceLabel: "₹ 1,84,000",
    category: "Maharaja Collection",
    tagline: "The collection’s signature heirloom drape.",
    description:
      "The Maharani is the pinnacle of the collection — deep maroon silk, dense gold zari, and a pallu designed for lasting grandeur. Woven for those who collect, not merely wear.",
    image: "/maharaja/maharani.jpg?v=1",
    hover: "/maharaja/maharani-hover.jpg?v=1",
    colorName: "Maharani Maroon & Gold",
    hexColor: "#5c1520",
    details: {
      weave: "Imperial Mysore brocade weave",
      zari: "High-density pure gold zari",
      fabric: "100% pure mulberry silk, heavy denier",
      origin: "KSIC Atelier Looms, Mysuru",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "720 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Wide royal temple border",
      pallu: "Heirloom floral-geometric pallu",
    },
  },
];

export function getMaharajaProduct(slug: string) {
  return MAHARAJA_PRODUCTS.find((p) => p.slug === slug);
}

export function getMaharajaSlugs() {
  return MAHARAJA_PRODUCTS.map((p) => p.slug);
}
