export type SareeCategory =
  | "all"
  | "pure-silk"
  | "zari"
  | "temple"
  | "pastel"
  | "bridal"
  | "traditional"
  | "contemporary";

export type SareeSwatch = {
  id: string;
  label: string;
  hex: string;
  image?: string;
};

export type SareeProduct = {
  id: string;
  code: string;
  name: string;
  description: string;
  story: string;
  price: number;
  badge: string;
  image: string;
  fabric: string;
  categories: Exclude<SareeCategory, "all">[];
  featured: number;
  swatches: SareeSwatch[];
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
    blouse: string;
  };
};

export const SAREES: SareeProduct[] = [
  {
    id: "royal-white",
    code: "WS-001",
    name: "Royal White Mysore Silk Saree",
    description: "With Grand Gold Zari Border",
    story:
      "Ivory Mysore silk with a grand gold zari border, woven for occasions that ask for quiet splendour. The body stays luminous and unpatterned so the border and pallu carry the ornament — a royal white that reads as ceremony without weight.",
    price: 28500,
    badge: "Bestseller",
    image: "/sarees/royal-white.jpg",
    fabric: "/sarees/fabric-royal-white.jpg",
    categories: ["pure-silk", "zari", "traditional"],
    featured: 1,
    swatches: [
      { id: "ivory", label: "Ivory", hex: "#f3ead7", image: "/sarees/royal-white.jpg" },
      { id: "gold", label: "Gold", hex: "#c6a15b", image: "/sarees/classic-white.jpg" },
      { id: "emerald", label: "Emerald", hex: "#1f6b4a", image: "/sarees/emerald.jpg" },
      { id: "maroon", label: "Maroon", hex: "#6b2430", image: "/sarees/bridal-red.jpg" },
      { id: "ruby", label: "Ruby", hex: "#8d2d3a", image: "/sarees/bridal-red.jpg" },
    ],
    details: {
      weave: "Traditional Mysore handloom satin weave",
      zari: "Pure gold zari on the border and pallu",
      fabric: "100% pure mulberry silk",
      origin: "KSIC Heritage Looms, Mysuru",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "620 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Grand gold zari border",
      pallu: "Ornate gold pallu with floral zari",
      blouse: "Matching unstitched blouse piece",
    },
  },
  {
    id: "classic-white",
    code: "WS-002",
    name: "Classic White Mysore Silk Saree",
    description: "With Thin Gold Border",
    story:
      "A quieter white — cream silk finished with a fine gold line. Made for days that want the signature Mysore sheen without a wide ceremonial border.",
    price: 22500,
    badge: "New Arrival",
    image: "/sarees/classic-white.jpg",
    fabric: "/sarees/fabric-classic-white.jpg",
    categories: ["pure-silk", "pastel", "traditional"],
    featured: 2,
    swatches: [
      { id: "cream", label: "Cream", hex: "#f7f1e4", image: "/sarees/classic-white.jpg" },
      { id: "blush", label: "Blush", hex: "#e7cfc4", image: "/sarees/blush.jpg" },
      { id: "gold", label: "Champagne", hex: "#d7c4a3", image: "/sarees/royal-white.jpg" },
      { id: "forest", label: "Forest", hex: "#2f4a3c", image: "/sarees/emerald.jpg" },
      { id: "navy", label: "Navy", hex: "#243654", image: "/sarees/royal-blue.jpg" },
      { id: "wine", label: "Wine", hex: "#6a2e38", image: "/sarees/bridal-red.jpg" },
    ],
    details: {
      weave: "Fine Mysore silk weave",
      zari: "Thin pure gold zari line",
      fabric: "100% pure mulberry silk",
      origin: "KSIC Heritage Looms, Mysuru",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "560 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Slim gold border",
      pallu: "Matching fine gold edge",
      blouse: "Matching unstitched blouse piece",
    },
  },
  {
    id: "blush",
    code: "WS-003",
    name: "Soft Blush Mysore Silk Saree",
    description: "With Traditional Zari Motifs",
    story:
      "Soft blush silk scattered with traditional zari motifs. The colour stays gentle; the gold work gives the drape its heritage.",
    price: 24000,
    badge: "Editor's Pick",
    image: "/sarees/blush.jpg",
    fabric: "/sarees/fabric-blush.jpg",
    categories: ["zari", "pastel"],
    featured: 3,
    swatches: [
      { id: "blush", label: "Blush", hex: "#e7c3c8", image: "/sarees/blush.jpg" },
      { id: "rose", label: "Rose", hex: "#d7aeb6", image: "/sarees/blush.jpg" },
      { id: "emerald", label: "Emerald", hex: "#1c6a45", image: "/sarees/emerald.jpg" },
      { id: "navy", label: "Navy", hex: "#1d2f55", image: "/sarees/royal-blue.jpg" },
      { id: "ivory", label: "Ivory", hex: "#f4ead8", image: "/sarees/royal-white.jpg" },
      { id: "maroon", label: "Maroon", hex: "#6d2832", image: "/sarees/bridal-red.jpg" },
      { id: "gold", label: "Gold", hex: "#c9a36a", image: "/sarees/classic-white.jpg" },
    ],
    details: {
      weave: "Mysore silk with butta motifs",
      zari: "Traditional gold zari motifs",
      fabric: "100% pure mulberry silk",
      origin: "KSIC Heritage Looms, Mysuru",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "590 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Zari border with floral repeat",
      pallu: "Motif-rich pallu",
      blouse: "Matching unstitched blouse piece",
    },
  },
  {
    id: "bridal-red",
    code: "WS-004",
    name: "Royal Bridal Red Mysore Silk Saree",
    description: "With Heritage Gold Zari",
    story:
      "Bridal red Mysore silk, dense with heritage gold zari. Woven for the wedding day and the years that follow — a saree meant to be kept.",
    price: 32500,
    badge: "Bridal",
    image: "/sarees/bridal-red.jpg",
    fabric: "/sarees/fabric-bridal-red.jpg",
    categories: ["bridal", "zari", "traditional"],
    featured: 4,
    swatches: [
      { id: "bridal", label: "Bridal red", hex: "#8a1e2b", image: "/sarees/bridal-red.jpg" },
      { id: "maroon", label: "Maroon", hex: "#5c1822", image: "/sarees/bridal-red.jpg" },
      { id: "gold", label: "Gold", hex: "#c6a15b", image: "/sarees/royal-white.jpg" },
      { id: "ivory", label: "Ivory", hex: "#f3ead7", image: "/sarees/classic-white.jpg" },
    ],
    details: {
      weave: "Heavy bridal Mysore silk weave",
      zari: "Heritage gold zari",
      fabric: "100% pure mulberry silk",
      origin: "KSIC Heritage Looms, Mysuru",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "680 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Wide ceremonial gold border",
      pallu: "Dense heritage pallu",
      blouse: "Matching unstitched blouse piece",
    },
  },
  {
    id: "emerald",
    code: "WS-005",
    name: "Emerald Green Mysore Silk Saree",
    description: "With Temple Border",
    story:
      "Deep emerald silk framed by a temple border. The green holds its own against gold, in the manner of palace sarees worn for festivals.",
    price: 26500,
    badge: "Traditional",
    image: "/sarees/emerald.jpg",
    fabric: "/sarees/fabric-emerald.jpg",
    categories: ["temple", "traditional", "pure-silk"],
    featured: 5,
    swatches: [
      { id: "emerald", label: "Emerald", hex: "#1b6844", image: "/sarees/emerald.jpg" },
      { id: "forest", label: "Forest", hex: "#234536", image: "/sarees/emerald.jpg" },
      { id: "gold", label: "Gold", hex: "#c6a15b", image: "/sarees/royal-white.jpg" },
      { id: "ivory", label: "Ivory", hex: "#f3ead7", image: "/sarees/classic-white.jpg" },
    ],
    details: {
      weave: "Traditional Mysore silk weave",
      zari: "Gold temple zari",
      fabric: "100% pure mulberry silk",
      origin: "KSIC Heritage Looms, Mysuru",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "610 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Temple border in gold zari",
      pallu: "Temple-motif pallu",
      blouse: "Matching unstitched blouse piece",
    },
  },
  {
    id: "royal-blue",
    code: "WS-006",
    name: "Royal Blue Mysore Silk Saree",
    description: "Contemporary Zari Collection",
    story:
      "Royal blue silk from the contemporary zari edit — a jewel tone with gold that stays precise rather than heavy. Made for evenings that want colour first.",
    price: 27500,
    badge: "Contemporary",
    image: "/sarees/royal-blue.jpg",
    fabric: "/sarees/fabric-royal-blue.jpg",
    categories: ["contemporary", "zari", "pure-silk"],
    featured: 6,
    swatches: [
      { id: "blue", label: "Royal blue", hex: "#1d3f86", image: "/sarees/royal-blue.jpg" },
      { id: "navy", label: "Navy", hex: "#162848", image: "/sarees/royal-blue.jpg" },
      { id: "gold", label: "Gold", hex: "#c6a15b", image: "/sarees/classic-white.jpg" },
      { id: "ivory", label: "Ivory", hex: "#f3ead7", image: "/sarees/royal-white.jpg" },
    ],
    details: {
      weave: "Contemporary Mysore silk weave",
      zari: "Fine gold zari",
      fabric: "100% pure mulberry silk",
      origin: "KSIC Heritage Looms, Mysuru",
      length: "5.5 metres with 0.8 metre blouse piece",
      weight: "600 grams",
      certification: "Silk Mark Certified & GI Tagged",
      border: "Contemporary gold border",
      pallu: "Zari pallu with a clean field",
      blouse: "Matching unstitched blouse piece",
    },
  },
];

export function getSaree(id: string) {
  return SAREES.find((saree) => saree.id === id);
}

export function getSareeIds() {
  return SAREES.map((saree) => saree.id);
}
