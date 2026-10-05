export type ToneMode = "single" | "dual" | "contrast" | "custom";
export type ViewMode = "full" | "upper" | "border" | "pallu" | "fabric";
export type LightMode = "natural" | "warm" | "cool" | "indoor" | "evening";

export type StepId =
  | "colour"
  | "weave"
  | "zari"
  | "border"
  | "pallu"
  | "motifs"
  | "preview";

export interface ColourOption {
  id: string;
  name: string;
  hex: string;
  filter: string;
  price: number;
}

export interface ChoiceOption {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
}

export const STEPS: { id: StepId; number: string; label: string }[] = [
  { id: "colour", number: "01", label: "Colour & Tone" },
  { id: "weave", number: "02", label: "Weave Pattern" },
  { id: "zari", number: "03", label: "Zari" },
  { id: "border", number: "04", label: "Border" },
  { id: "pallu", number: "05", label: "Pallu" },
  { id: "motifs", number: "06", label: "Motifs" },
  { id: "preview", number: "07", label: "Preview & Save" },
];

export const COLOURS: ColourOption[] = [
  { id: "maroon", name: "Maroon", hex: "#6B1C28", filter: "sepia(0.35) saturate(1.4) hue-rotate(-18deg) brightness(0.92)", price: 0 },
  { id: "ruby", name: "Ruby", hex: "#8B1E2D", filter: "sepia(0.3) saturate(1.55) hue-rotate(-12deg) brightness(0.95)", price: 4000 },
  { id: "rani", name: "Rani Pink", hex: "#C23A6B", filter: "sepia(0.25) saturate(1.7) hue-rotate(-35deg) brightness(1.05)", price: 5000 },
  { id: "blush", name: "Blush", hex: "#E8A0A8", filter: "sepia(0.2) saturate(1.1) hue-rotate(-25deg) brightness(1.2)", price: 3000 },
  { id: "purple", name: "Purple", hex: "#5B2C6F", filter: "sepia(0.25) saturate(1.5) hue-rotate(-55deg) brightness(0.95)", price: 4500 },
  { id: "royal", name: "Royal Blue", hex: "#1F3A8A", filter: "sepia(0.2) saturate(1.6) hue-rotate(175deg) brightness(0.9)", price: 5000 },
  { id: "navy", name: "Navy", hex: "#14213D", filter: "sepia(0.25) saturate(1.2) hue-rotate(180deg) brightness(0.78)", price: 4000 },
  { id: "emerald", name: "Emerald", hex: "#0F4C3A", filter: "sepia(0.3) saturate(1.45) hue-rotate(85deg) brightness(0.88)", price: 5500 },
  { id: "bottle", name: "Bottle Green", hex: "#12352B", filter: "sepia(0.35) saturate(1.25) hue-rotate(95deg) brightness(0.8)", price: 4500 },
  { id: "mustard", name: "Mustard", hex: "#C4A035", filter: "sepia(0.55) saturate(1.4) hue-rotate(5deg) brightness(1.1)", price: 3500 },
  { id: "ivory", name: "Ivory", hex: "#F4EEE3", filter: "sepia(0.15) saturate(0.55) brightness(1.35)", price: 2500 },
  { id: "champagne", name: "Champagne", hex: "#E8D5B5", filter: "sepia(0.35) saturate(0.7) brightness(1.25)", price: 3000 },
  { id: "peach", name: "Peach", hex: "#E8B4A0", filter: "sepia(0.3) saturate(1.05) hue-rotate(-10deg) brightness(1.2)", price: 3000 },
  { id: "grey", name: "Grey", hex: "#6B6560", filter: "grayscale(0.55) brightness(0.95) contrast(1.05)", price: 2000 },
  { id: "black", name: "Black", hex: "#1A1512", filter: "brightness(0.55) contrast(1.15) saturate(0.7)", price: 3500 },
];

export const WEAVES: ChoiceOption[] = [
  { id: "classic", name: "Classic Mysore", description: "The pure house weave.", image: "/silk-threads.jpg", price: 0 },
  { id: "traditional", name: "Traditional", description: "Time-honoured depth.", image: "/loom-craft.jpg", price: 8000 },
  { id: "fine", name: "Fine Texture", description: "Refined and light.", image: "/zari-macro.jpg", price: 12000 },
  { id: "contemporary", name: "Contemporary", description: "Modern restraint.", image: "/prod-blue.jpg", price: 10000 },
  { id: "custom", name: "Custom", description: "Bespoke with our atelier.", image: "/heritage-palace.jpg", price: 25000 },
];

export const ZARIS: ChoiceOption[] = [
  { id: "gold", name: "Gold Zari", description: "Warm, luminous and traditional.", image: "/gold-thread.jpg", price: 18000 },
  { id: "silver", name: "Silver Zari", description: "Cool, refined and contemporary.", image: "/silk-threads.jpg", price: 15000 },
  { id: "both", name: "Gold + Silver", description: "A dual metallic presence.", image: "/zari-macro.jpg", price: 28000 },
  { id: "antique", name: "Antique Zari", description: "Muted heritage lustre.", image: "/prod-vermilion.jpg", price: 22000 },
];

export const BORDERS: ChoiceOption[] = [
  { id: "minimal", name: "Minimal", image: "/silk-threads.jpg", price: 0 },
  { id: "classic", name: "Classic", image: "/zari-macro.jpg", price: 6000 },
  { id: "temple", name: "Temple", image: "/gold-thread.jpg", price: 14000 },
  { id: "floral", name: "Floral", image: "/collection-1.jpg", price: 12000 },
  { id: "royal", name: "Mysore Royal", image: "/hero-campaign.jpg", price: 22000 },
  { id: "elephant", name: "Elephant", image: "/heritage-palace.jpg", price: 18000 },
  { id: "peacock", name: "Peacock", image: "/indian-saree-1.jpg", price: 20000 },
];

export const PALLUS: ChoiceOption[] = [
  { id: "classic", name: "Classic Pallu", image: "/zari-macro.jpg", price: 8000 },
  { id: "royal", name: "Royal Pallu", image: "/hero-campaign.jpg", price: 18000 },
  { id: "temple", name: "Temple Pallu", image: "/gold-thread.jpg", price: 16000 },
  { id: "floral", name: "Floral Pallu", image: "/collection-1.jpg", price: 14000 },
  { id: "peacock", name: "Peacock Pallu", image: "/indian-saree-1.jpg", price: 22000 },
  { id: "minimal", name: "Minimal Pallu", image: "/silk-threads.jpg", price: 4000 },
];

export const MOTIFS: ChoiceOption[] = [
  { id: "none", name: "No Motif", image: "/silk-threads.jpg", price: 0 },
  { id: "butta", name: "Small Butta", image: "/zari-macro.jpg", price: 6000 },
  { id: "mango", name: "Mango", image: "/collection-1.jpg", price: 9000 },
  { id: "peacock", name: "Peacock", image: "/indian-saree-1.jpg", price: 14000 },
  { id: "temple", name: "Temple", image: "/gold-thread.jpg", price: 11000 },
  { id: "floral", name: "Floral", image: "/prod-vermilion.jpg", price: 10000 },
  { id: "geometric", name: "Geometric", image: "/prod-blue.jpg", price: 8000 },
];

export const BORDER_WIDTHS = ["Small", "Medium", "Wide", "Statement"] as const;
export const MOTIF_SIZES = ["Small", "Medium", "Large"] as const;
export const MOTIF_DENSITIES = ["Sparse", "Balanced", "Rich"] as const;
export const MOTIF_PLACEMENTS = ["All Over", "Body", "Pallu", "Border"] as const;

export const BASE_PRICE = 145000;

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function createDesignId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `MS-CUSTOM-${n}`;
}
