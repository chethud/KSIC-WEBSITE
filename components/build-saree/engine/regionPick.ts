import * as THREE from 'three';

export type PickableRegion = 'border' | 'pallu' | 'blouse' | 'zari' | 'colour';

export type RegionStep =
  | 'colour'
  | 'border'
  | 'pallu'
  | 'blouse'
  | 'zari'
  | 'finish';

export type HoverRegion = 'none' | 'border' | 'pallu' | 'zari' | 'blouse';

/** Maps a picked fabric region to the customizer step. */
export const REGION_TO_STEP: Record<PickableRegion, RegionStep> = {
  colour: 'colour',
  border: 'border',
  pallu: 'pallu',
  blouse: 'blouse',
  zari: 'zari',
};

export const REGION_LABEL: Record<PickableRegion, string> = {
  colour: 'Colour',
  border: 'Border',
  pallu: 'Pallu',
  blouse: 'Blouse',
  zari: 'Zari',
};

type MaskKey =
  | 'skin'
  | 'mainSaree'
  | 'border'
  | 'pallu'
  | 'palluBorder'
  | 'blouse'
  | 'zari';

export type RegionMaskSet = Partial<Record<MaskKey, THREE.Texture | null>>;

type CachedMask = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

const cache = new Map<THREE.Texture, CachedMask>();

/** Drop sampled mask pixels after interactive assign paints. */
export function clearRegionPickCache(): void {
  cache.clear();
}

function cacheMask(tex: THREE.Texture): CachedMask | null {
  const img = tex.image as CanvasImageSource | undefined;
  if (!img) return null;

  // Canvas masks change in place while assigning — always read live pixels.
  if (img instanceof HTMLCanvasElement) {
    const w = img.width;
    const h = img.height;
    if (!w || !h) return null;
    const ctx = img.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    return {
      data: ctx.getImageData(0, 0, w, h).data,
      width: w,
      height: h,
    };
  }

  const hit = cache.get(tex);
  if (hit) return hit;
  const w =
    'width' in img && typeof img.width === 'number'
      ? img.width
      : (img as HTMLImageElement).naturalWidth;
  const h =
    'height' in img && typeof img.height === 'number'
      ? img.height
      : (img as HTMLImageElement).naturalHeight;
  if (!w || !h) return null;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);
  const entry: CachedMask = {
    data: ctx.getImageData(0, 0, w, h).data,
    width: w,
    height: h,
  };
  cache.set(tex, entry);
  return entry;
}

function sampleMask(tex: THREE.Texture | null | undefined, u: number, v: number): number {
  if (!tex) return 0;
  const m = cacheMask(tex);
  if (!m) return 0;
  const uu = ((u % 1) + 1) % 1;
  const vv = ((v % 1) + 1) % 1;
  // glTF + Three flipY=false: V=0 → TOP row of ImageData (matches bake + assign paint).
  const x = Math.min(m.width - 1, Math.max(0, Math.floor(uu * m.width)));
  const y = Math.min(m.height - 1, Math.max(0, Math.floor(vv * m.height)));
  return m.data[(y * m.width + x) * 4] / 255;
}

/**
 * Resolve which customizable region owns this UV.
 * Priority: zari → border/palluBorder → pallu → blouse → main silk.
 * Skin/hair/empty → null (ignore).
 */
export function pickRegionAtUv(
  u: number,
  v: number,
  masks: RegionMaskSet,
  threshold = 0.28,
): PickableRegion | null {
  const skin = sampleMask(masks.skin, u, v);
  if (skin > 0.45) return null;

  const scores: Array<{ region: PickableRegion; score: number }> = [
    { region: 'zari', score: sampleMask(masks.zari, u, v) },
    {
      region: 'border',
      score: Math.max(
        sampleMask(masks.border, u, v),
        sampleMask(masks.palluBorder, u, v),
      ),
    },
    { region: 'pallu', score: sampleMask(masks.pallu, u, v) },
    { region: 'blouse', score: sampleMask(masks.blouse, u, v) },
    { region: 'colour', score: sampleMask(masks.mainSaree, u, v) },
  ];

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];
  if (!best || best.score < threshold) {
    // Soft fallback: any fabric-ish hit → colour
    if (best && best.score > 0.12) return best.region;
    return null;
  }
  return best.region;
}

/** Hover chip mapping used by the 2D preview highlight. */
export function hoverFromRegion(region: PickableRegion | null): HoverRegion {
  if (!region || region === 'colour') return 'none';
  return region;
}
