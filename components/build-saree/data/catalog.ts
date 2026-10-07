import type { CatalogItem, SareeConfiguration } from '../types/customization';

export const BASE_PRICE = 24999;

export const STEPS = [
  { id: 'colour' as const, label: 'Colour', number: '1' },
  { id: 'border' as const, label: 'Border', number: '2' },
  { id: 'pallu' as const, label: 'Pallu', number: '3' },
  { id: 'zari' as const, label: 'Zari', number: '4' },
  { id: 'finish' as const, label: 'Finish', number: '5' },
];

export const COLOUR_CATEGORIES: { id: import('../types/customization').ColourCategory; label: string }[] = [
  { id: 'all', label: 'All Colours' },
  { id: 'reds', label: 'Reds & Pinks' },
  { id: 'blues', label: 'Blues' },
  { id: 'greens', label: 'Greens' },
  { id: 'purples', label: 'Purples' },
  { id: 'neutrals', label: 'Neutrals' },
  { id: 'pastels', label: 'Pastels' },
];

/** Premium saree colours — fabricImage = draped silk fold swatch for the picker */
export const COLORS: CatalogItem[] = [
  {
    id: 'ruby-red',
    name: 'Ruby Red',
    type: 'color',
    category: 'reds',
    tone: 'Deep / Jewel',
    hex: '#9E1B32',
    popular: true,
    description: 'A classic jewel tone inspired by traditional Mysore silk. Rich, ceremonial and timeless.',
    fabricImage: '/models/saree_swatches/ruby-red.jpg?v=3',
    priceAdjustment: 0,
  },
  {
    id: 'fuchsia',
    name: 'Fuchsia',
    type: 'color',
    category: 'reds',
    tone: 'Bright / Festive',
    hex: '#C2185B',
    description: 'Vivid festive fuchsia with lively silk catch — bold and celebratory.',
    fabricImage: '/models/saree_swatches/fuchsia.jpg?v=3',
    priceAdjustment: 0,
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    type: 'color',
    category: 'blues',
    tone: 'Deep / Jewel',
    hex: '#183A72',
    description: 'Regal cobalt silk with controlled highlights and jewel clarity.',
    fabricImage: '/models/saree_swatches/royal-blue.jpg?v=3',
    priceAdjustment: 0,
  },
  {
    id: 'peacock',
    name: 'Peacock',
    type: 'color',
    category: 'blues',
    tone: 'Jewel / Lush',
    hex: '#087F82',
    description: 'Lush teal-blue silk recalling Mysore palace gardens.',
    fabricImage: '/models/saree_swatches/peacock.jpg?v=3',
    priceAdjustment: 0,
  },
  {
    id: 'deep-emerald',
    name: 'Deep Emerald',
    type: 'color',
    category: 'greens',
    tone: 'Rich / Forest',
    hex: '#126B55',
    description: 'Forest emerald with luminous silk catch — rich and composed.',
    fabricImage: '/models/saree_swatches/deep-emerald.jpg?v=3',
    priceAdjustment: 0,
  },
  {
    id: 'pine',
    name: 'Pine',
    type: 'color',
    category: 'greens',
    tone: 'Deep / Cool',
    hex: '#0E4F4A',
    description: 'Cool pine silk with deep shade folds — composed and contemporary.',
    fabricImage: '/models/saree_swatches/pine.jpg?v=3',
    priceAdjustment: 0,
  },
  {
    id: 'lavender',
    name: 'Lavender',
    type: 'color',
    category: 'purples',
    tone: 'Soft / Jewel',
    hex: '#7B5EA7',
    description: 'Amethyst lavender silk with soft luminous folds.',
    fabricImage: '/models/saree_swatches/lavender.jpg?v=3',
    priceAdjustment: 0,
  },
  {
    id: 'mustard',
    name: 'Mustard',
    type: 'color',
    category: 'neutrals',
    tone: 'Warm / Heritage',
    hex: '#C89A18',
    description: 'Heritage gold-mustard silk with warm ceremonial glow.',
    fabricImage: '/models/saree_swatches/mustard.jpg?v=3',
    priceAdjustment: 500,
  },
  {
    id: 'black',
    name: 'Black',
    type: 'color',
    category: 'neutrals',
    tone: 'Deep / Evening',
    hex: '#1A1412',
    description: 'Deep evening black with controlled silk sheen — dramatic and timeless.',
    fabricImage: '/models/saree_swatches/black.jpg?v=3',
    priceAdjustment: 0,
  },
];

/**
 * Legacy named shades (kept for saved designs).
 * Live UI uses a continuous depth string "0"–"1" (bright → near-black).
 */
export const SHADES: CatalogItem[] = [
  { id: 'light', name: 'Light', type: 'shade', priceAdjustment: 0, material: '0.12' },
  { id: 'soft', name: 'Soft', type: 'shade', priceAdjustment: 0, material: '0.35' },
  { id: 'classic', name: 'Classic', type: 'shade', priceAdjustment: 0, material: '0.55' },
  { id: 'deep', name: 'Deep', type: 'shade', priceAdjustment: 0, material: '0.82' },
];

export {
  BORDERS,
  BORDER_CATEGORIES,
  borderTextureOf,
  bordersInCategory,
} from './borders';
export type { BorderCategory, BorderTexture } from './borders';

/** 4 border colours */
export const BORDER_COLORS: CatalogItem[] = [
  { id: 'antique-gold', name: 'Antique Gold', type: 'borderColor', hex: '#B8963E', priceAdjustment: 0, metalness: 0.88, roughness: 0.35 },
  { id: 'pure-gold', name: 'Pure Gold', type: 'borderColor', hex: '#E8C547', priceAdjustment: 1200, metalness: 0.95, roughness: 0.22 },
  { id: 'silver', name: 'Silver', type: 'borderColor', hex: '#C0C5CE', priceAdjustment: 600, metalness: 0.92, roughness: 0.2 },
  { id: 'rose-gold', name: 'Rose Gold', type: 'borderColor', hex: '#B76E79', priceAdjustment: 900, metalness: 0.9, roughness: 0.28 },
];

/** 4 pallu designs */
export const PALLUS: CatalogItem[] = [
  { id: 'royal', name: 'Royal Temple', type: 'pallu', description: 'Dense gold zari', fabricImage: '/models/pallu/royal.jpg?v=1', priceAdjustment: 5500, texture: 'royal', mask: 'pallu-mask' },
  { id: 'traditional', name: 'Traditional Mysore', type: 'pallu', description: 'Classic motif', fabricImage: '/models/pallu/traditional.jpg?v=1', priceAdjustment: 2200, texture: 'traditional', mask: 'pallu-mask' },
  { id: 'statement', name: 'Grand Zari', type: 'pallu', description: 'Rich traditional weave', fabricImage: '/models/pallu/statement.jpg?v=1', priceAdjustment: 4800, texture: 'statement', mask: 'pallu-mask' },
  { id: 'minimal', name: 'Contemporary Minimal', type: 'pallu', description: 'Minimal border', fabricImage: '/models/pallu/minimal.jpg?v=1', priceAdjustment: 900, texture: 'minimal', mask: 'pallu-mask' },
];

/** 5 blouse combinations */
export const BLOUSES: CatalogItem[] = [
  { id: 'matching', name: 'Matching', type: 'blouse', description: 'Same as saree', priceAdjustment: 0, material: 'matching' },
  { id: 'contrast', name: 'Contrast', type: 'blouse', description: 'Complementary contrast', priceAdjustment: 800, material: 'contrast' },
  { id: 'darker', name: 'Darker Tone', type: 'blouse', description: 'Deepened shade', priceAdjustment: 400, material: 'darker' },
  { id: 'lighter', name: 'Lighter Tone', type: 'blouse', description: 'Softened shade', priceAdjustment: 400, material: 'lighter' },
  { id: 'ivory-blouse', name: 'Ivory Blouse', type: 'blouse', description: 'Soft ivory contrast', priceAdjustment: 600, material: 'fixed', hex: '#F2E8D5' },
];

/** 3 zari finishes — Gold / Silver / Gold & Silver */
export const ZARIS: CatalogItem[] = [
  {
    id: 'antique-gold',
    name: 'Gold Zari',
    type: 'zari',
    tone: 'Traditional',
    description: 'Traditional and timeless, crafted with real gold finish threads.',
    hex: '#C5A059',
    fabricImage: '/models/zari/gold.jpg?v=1',
    priceAdjustment: 5200,
    metalness: 0.92,
    roughness: 0.28,
    material: '0.9',
  },
  {
    id: 'silver',
    name: 'Silver Zari',
    type: 'zari',
    tone: 'Elegant',
    description: 'Elegant and graceful, perfect for contemporary and classic designs.',
    hex: '#D0D5DD',
    fabricImage: '/models/zari/silver.jpg?v=1',
    priceAdjustment: 3800,
    metalness: 0.94,
    roughness: 0.2,
    material: '0.75',
  },
  {
    id: 'pure-gold',
    name: 'Gold & Silver Zari',
    type: 'zari',
    tone: 'Distinctive',
    description: 'A royal combination for a distinctive and premium look.',
    hex: '#E2C98D',
    fabricImage: '/models/zari/gold-silver.jpg?v=1',
    priceAdjustment: 6500,
    metalness: 0.95,
    roughness: 0.22,
    material: '1',
  },
];

/** 3 silk finishes */
export const FINISHES: CatalogItem[] = [
  { id: 'soft-silk', name: 'Soft Silk', type: 'finish', description: 'Gentle light catch', fabricImage: '/models/finish/soft.jpg?v=1', priceAdjustment: 800, roughness: 0.38, metalness: 0.04, sheen: 0.55 },
  { id: 'rich-silk', name: 'Rich Silk', type: 'finish', description: 'Deep luminous body', fabricImage: '/models/finish/rich.jpg?v=1', priceAdjustment: 1800, roughness: 0.28, metalness: 0.06, sheen: 0.75 },
  { id: 'lustrous-silk', name: 'Lustrous Silk', type: 'finish', description: 'Brilliant silk glow', fabricImage: '/models/finish/lustrous.jpg?v=1', priceAdjustment: 2500, roughness: 0.18, metalness: 0.08, sheen: 0.95 },
];

export const DEFAULT_CONFIGURATION: SareeConfiguration = {
  colorMode: 'single',
  color: 'ruby-red',
  secondaryColor: 'royal-blue',
  shade: '0.45',
  border: 'mysore-classic',
  borderColor: 'antique-gold',
  pallu: 'royal',
  blouse: 'matching',
  zari: 'antique-gold',
  finish: 'soft-silk',
  designName: '',
  designId: null,
};

export const CAMERA_VIEWS: { id: import('../types/customization').CameraView; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'side', label: 'Side' },
  { id: 'back', label: 'Back' },
  { id: 'detail', label: 'Detail' },
];

/** Primary model views shown in the atelier view rail */
export const MODEL_VIEWS = CAMERA_VIEWS;

/** Same hero as “make your own saree”: public/models/saree-hero.glb */
export const HERO_MODEL_PATH = '/models/saree-hero.glb?v=110';
export const MASTER_SAREE_PATH = '/models/MASTER_SAREE.glb?v=109';
export const MASTER_SAREE_OPTIMIZED_PATH = '/models/MASTER_SAREE_OPTIMIZED.glb?v=109';
export const SAREE_FABRIC_MASK_PATH = '/models/saree_fabric_mask.png?v=107';
export const SAREE_FABRIC_LUMA_PATH = '/models/saree_fabric_luma.png?v=107';
export const SAREE_PLAIN_PAINT_MASK_PATH = '/models/saree_plain_paint_mask.png?v=106';
export const SAREE_HUMAN_LOCK_PATH = '/models/saree_human_lock.png?v=106';

/**
 * UV-locked semantic region masks (CASE-D atlas space).
 *
 * Author with `/saree-segmentation.html` (UV atlas paint → Export masks),
 * then overwrite the PNGs under `public/models/` (or `public/saree/segmentation/`).
 * Bump `?v=` after replacing files so the browser reloads them.
 */
export const REGION_MASK_PATHS = {
  skin: '/models/region_skin.png?v=121',
  hair: '/models/region_hair.png?v=121',
  blouse: '/models/region_blouse.png?v=121',
  mainSaree: '/models/region_saree_main.png?v=121',
  border: '/models/region_border.png?v=121',
  pallu: '/models/region_pallu.png?v=121',
  palluBorder: '/models/region_pallu_border.png?v=121',
  zari: '/models/region_zari.png?v=121',
} as const;

/**
 * Mirror paths for editor exports under `public/saree/segmentation/`.
 * Same bytes as REGION_MASK_PATHS when you copy exported `region_*.png` / `*-mask.png` there.
 */
export const GROUND_TRUTH_MASK_PATHS = {
  mainSaree: '/saree/segmentation/region_saree_main.png',
  pallu: '/saree/segmentation/region_pallu.png',
  border: '/saree/segmentation/region_border.png',
  palluBorder: '/saree/segmentation/region_pallu_border.png',
  zari: '/saree/segmentation/region_zari.png',
  blouse: '/saree/segmentation/region_blouse.png',
  bodyMask: '/saree/segmentation/body-mask.png',
  packed: '/saree/segmentation/segmentation-mask.png',
  config: '/saree/segmentation/segmentation.json',
} as const;

/** Named material slots on MASTER_SAREE.glb */
export const MATERIAL_SLOTS = {
  SAREE_BODY: 'MATERIAL_01_BODY',
  BORDER: 'MATERIAL_02_BORDER',
  PALLU: 'MATERIAL_03_PALLU',
  PALLU_BORDER: 'MATERIAL_04_PALLU_BORDER',
  ZARI: 'MATERIAL_05_ZARI',
  BLOUSE: 'MATERIAL_06_BLOUSE',
  SKIN: 'MATERIAL_07_SKIN',
  HAIR: 'MATERIAL_08_HAIR',
} as const;
