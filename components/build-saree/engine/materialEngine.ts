import type {
  CatalogItem,
  PriceBreakdown,
  ResolvedMaterials,
  SareeConfiguration,
} from '../types/customization';
import {
  BASE_PRICE,
  BLOUSES,
  BORDER_COLORS,
  BORDERS,
  COLORS,
  FINISHES,
  PALLUS,
  SHADES,
  ZARIS,
} from '../data/catalog';

function find<T extends CatalogItem>(
  list: T[],
  id: string | null | undefined,
): T | undefined {
  if (!id) return undefined;
  return list.find((i) => i.id === id);
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const raw = hex.replace('#', '');
  const r = parseInt(raw.slice(0, 2), 16) / 255;
  const g = parseInt(raw.slice(2, 4), 16) / 255;
  const b = parseInt(raw.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    default:
      h = ((r - g) / d + 4) / 6;
  }
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Legacy named shades → continuous depth 0 (bright) … 1 (near-black) */
const LEGACY_SHADE_DEPTH: Record<string, number> = {
  light: 0.12,
  soft: 0.35,
  classic: 0.55,
  deep: 0.82,
};

/** Parse shade id or continuous "0"–"1" string into depth. */
export function shadeDepth(shadeId: string): number {
  if (shadeId in LEGACY_SHADE_DEPTH) return LEGACY_SHADE_DEPTH[shadeId];
  const n = Number(shadeId);
  if (Number.isFinite(n)) return Math.min(1, Math.max(0, n));
  return 0.55;
}

/**
 * Continuous silk shade along a jewel→midnight ramp (matches shade gradient UI).
 * t = 0 → brighter / vivid; t = 1 → deep near-black of the same hue.
 */
export function applyShadeFactor(hex: string, t: number): string {
  const depth = Math.min(1, Math.max(0, t));
  const { h, s, l } = hexToHsl(hex);
  // Bright end: lift toward a vivid jewel; deep end: near-black navy of same hue
  const brightL = Math.min(0.58, Math.max(l + 0.22, l * 1.55));
  const deepL = Math.max(0.035, Math.min(l * 0.22, 0.1));
  // Ease into darkness so mid tones stay rich
  const eased = depth * depth * (3 - 2 * depth);
  const outL = brightL + (deepL - brightL) * eased;
  const outS = Math.min(1, s * (1.08 - depth * 0.28));
  return hslToHex(h, outS, outL);
}

function applyShadeLevel(hex: string, shadeId: string): string {
  return applyShadeFactor(hex, shadeDepth(shadeId));
}

/** CSS linear-gradient stops for the colour family’s full shade strip. */
export function shadeGradientCss(hex: string, axis: 'to bottom' | 'to right' = 'to bottom'): string {
  const stops = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => `${applyShadeFactor(hex, t)} ${t * 100}%`);
  return `linear-gradient(${axis}, ${stops.join(', ')})`;
}

export function catalogHex(colorId: string): string {
  return find(COLORS, colorId)?.hex ?? '#1B3A6B';
}

function darken(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0.05, l - amount));
}

function lighten(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.min(0.92, l + amount));
}

function contrast(hex: string): string {
  const { l } = hexToHsl(hex);
  return l > 0.55 ? darken(hex, 0.32) : lighten(hex, 0.26);
}

/** Resolve all visual materials from configuration (shared by 3D + preview) */
export function resolveMaterials(config: SareeConfiguration): ResolvedMaterials {
  const color = find(COLORS, config.color);
  const accent = find(COLORS, config.secondaryColor);
  const finish = find(FINISHES, config.finish);
  const borderColor = find(BORDER_COLORS, config.borderColor);
  const pallu = find(PALLUS, config.pallu);
  const blouse = find(BLOUSES, config.blouse);
  const zari = find(ZARIS, config.zari);

  // Phase 1: sareeBaseColor only — no shade multiply (avoids red×blue remnants)
  const sareeHex = color?.hex ?? '#9E1B32';
  const multiGradient = false;
  const sareeAccentHex = accent?.hex ?? sareeHex;

  // Blouse LOCKED to matching saree for stand-in preview identity only;
  // 3D hero atlas keeps blouse baked into locked non-silk pixels.
  let blouseHex = sareeHex;
  switch (blouse?.material) {
    case 'contrast':
      blouseHex = contrast(sareeHex);
      break;
    case 'darker':
      blouseHex = darken(sareeHex, 0.2);
      break;
    case 'lighter':
      blouseHex = lighten(sareeHex, 0.18);
      break;
    case 'fixed':
      blouseHex = blouse.hex ?? '#F2E8D5';
      break;
    default:
      blouseHex = sareeHex;
  }

  return {
    sareeHex,
    sareeAccentHex,
    multiGradient,
    sareeRoughness: finish?.roughness ?? 0.28,
    sareeMetalness: finish?.metalness ?? 0.06,
    sareeSheen: finish?.sheen ?? 0.75,
    borderHex: borderColor?.hex ?? '#B8963E',
    borderMetalness: borderColor?.metalness ?? 0.88,
    borderRoughness: borderColor?.roughness ?? 0.35,
    palluHex: sareeHex,
    palluPattern: pallu?.texture ?? 'royal',
    blouseHex,
    zariHex: zari?.hex ?? borderColor?.hex ?? '#B8963E',
    zariMetalness: zari?.metalness ?? 0.9,
    zariRoughness: zari?.roughness ?? 0.3,
    zariIntensity: zari?.material ? Number(zari.material) : 0.85,
  };
}

export function calculatePrice(config: SareeConfiguration): PriceBreakdown {
  const items: CatalogItem[] = [
    find(COLORS, config.color),
    find(SHADES, config.shade),
    find(BORDERS, config.border),
    find(BORDER_COLORS, config.borderColor),
    find(PALLUS, config.pallu),
    find(BLOUSES, config.blouse),
    find(ZARIS, config.zari),
    find(FINISHES, config.finish),
  ].filter(Boolean) as CatalogItem[];

  const adjustments = items
    .filter((i) => i.priceAdjustment > 0)
    .map((i) => ({ label: i.name, amount: i.priceAdjustment }));

  const total =
    BASE_PRICE + adjustments.reduce((sum, a) => sum + a.amount, 0);

  return { base: BASE_PRICE, adjustments, total };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLabel(list: CatalogItem[], id: string | null): string {
  if (!id) return '';
  return find(list, id)?.name ?? id;
}

export function buildSummaryLines(config: SareeConfiguration): string[] {
  return [
    getLabel(COLORS, config.color),
    `${getLabel(BORDERS, config.border)} · ${getLabel(BORDER_COLORS, config.borderColor)}`,
    `${getLabel(PALLUS, config.pallu)} Pallu`,
    `${getLabel(ZARIS, config.zari)} Zari`,
    getLabel(FINISHES, config.finish),
  ];
}
