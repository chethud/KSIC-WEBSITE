/** MVP configuration — single source of truth for 3D and Interactive Preview */

export type RenderMode = 'webgl' | 'preview';

export type CameraView = 'front' | 'three-quarter' | 'side' | 'back' | 'detail';

export type ComponentType =
  | 'color'
  | 'shade'
  | 'border'
  | 'borderColor'
  | 'pallu'
  | 'blouse'
  | 'zari'
  | 'finish';

export type ColourCategory =
  | "all"
  | "reds"
  | "blues"
  | "greens"
  | "purples"
  | "neutrals"
  | "pastels";

export interface CatalogItem {
  id: string;
  name: string;
  type: ComponentType;
  description?: string;
  tone?: string;
  hex?: string;
  thumbnail?: string;
  /** Silk fabric preview for swatches */
  fabricImage?: string;
  category?: ColourCategory;
  popular?: boolean;
  priceAdjustment: number;
  /** Material / texture keys consumed by the material engine */
  material?: string;
  texture?: string;
  mask?: string;
  metalness?: number;
  roughness?: number;
  sheen?: number;
}

export interface SareeConfiguration {
  /** null until customer picks Single or Multi on the Colour step */
  colorMode: 'single' | 'multi' | null;
  /** null until customer picks a saree colour — no swatch selected on load */
  color: string | null;
  /** Used when colorMode is 'multi' — accent / second fabric colour */
  secondaryColor: string;
  shade: string;
  border: string;
  borderColor: string;
  pallu: string;
  blouse: string;
  zari: string;
  finish: string;
  designName: string;
  designId: string | null;
}

export interface ResolvedMaterials {
  sareeHex: string;
  /** Accent silk hex when colorMode is multi; same as sareeHex for single */
  sareeAccentHex: string;
  /** True when saree should render body→accent gradient */
  multiGradient: boolean;
  sareeRoughness: number;
  sareeMetalness: number;
  sareeSheen: number;
  borderHex: string;
  borderMetalness: number;
  borderRoughness: number;
  palluHex: string;
  palluPattern: string;
  blouseHex: string;
  zariHex: string;
  zariMetalness: number;
  zariRoughness: number;
  zariIntensity: number;
}

export interface PriceBreakdown {
  base: number;
  adjustments: { label: string; amount: number }[];
  total: number;
}

export interface SavedDesign {
  designId: string;
  configuration: SareeConfiguration;
  price: number;
  createdAt: string;
  customerName?: string;
}
