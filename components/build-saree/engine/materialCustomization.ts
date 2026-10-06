/**
 * Baseline-safe customization for CASE-D (single mesh + atlas).
 *
 * OPTION C — UV texture masks:
 * - Never deletes triangles / never nulls maps / never replaces MeshStandardMaterial wholesale
 * - Tints a CLONE of the albedo where the region mask is white
 * - Skin mask protects face/hands
 * - Baseline stays untouched until a colour is applied
 */
import * as THREE from 'three';
import { isSareeBaseMesh } from './sareeBaseMaterial';
import { borderPatternImageData } from './textures';

export type RegionKey =
  | 'skin'
  | 'hair'
  | 'accessories'
  | 'blouse'
  | 'mainSaree'
  | 'border'
  | 'pallu'
  | 'palluBorder'
  | 'zari';

export interface RegionSlot {
  mesh: THREE.Mesh;
  materialIndex: number;
}

export type RegionRegistry = Record<RegionKey, RegionSlot[]>;

export interface RegionMaskTextures {
  mainSaree?: THREE.Texture | null;
  border?: THREE.Texture | null;
  pallu?: THREE.Texture | null;
  palluBorder?: THREE.Texture | null;
  blouse?: THREE.Texture | null;
  zari?: THREE.Texture | null;
  skin?: THREE.Texture | null;
  hair?: THREE.Texture | null;
}

interface MaterialSnapshot {
  color: THREE.Color;
  map: THREE.Texture | null;
  roughness: number;
  metalness: number;
  material: THREE.MeshStandardMaterial;
}

type SlotKey = string;

function slotKey(mesh: THREE.Mesh, i: number): SlotKey {
  return `${mesh.uuid}:${i}`;
}

function asStandard(m: THREE.Material): THREE.MeshStandardMaterial | null {
  if (
    m instanceof THREE.MeshStandardMaterial ||
    m instanceof THREE.MeshPhysicalMaterial
  ) {
    return m;
  }
  return null;
}

function imageToCanvas(img: CanvasImageSource, w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  return c;
}

function sampleMask(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x: number,
  y: number,
): number {
  const i = (y * w + x) * 4;
  return data[i] / 255;
}

/** Separable max-dilate for RGBA masks (expands silk coverage into atlas holes). */
function dilateMaskRgba(
  src: Uint8ClampedArray,
  w: number,
  h: number,
  radius: number,
): Uint8ClampedArray {
  if (radius <= 0) return src;
  const tmp = new Uint8ClampedArray(src.length);
  const out = new Uint8ClampedArray(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let maxv = 0;
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        if (nx < 0 || nx >= w) continue;
        maxv = Math.max(maxv, src[(y * w + nx) * 4]);
      }
      const i = (y * w + x) * 4;
      tmp[i] = tmp[i + 1] = tmp[i + 2] = maxv;
      tmp[i + 3] = 255;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let maxv = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        maxv = Math.max(maxv, tmp[(ny * w + x) * 4]);
      }
      const i = (y * w + x) * 4;
      out[i] = out[i + 1] = out[i + 2] = maxv;
      out[i + 3] = 255;
    }
  }
  return out;
}

/** Separable min-erode for RGBA masks. */
function erodeMaskRgba(
  src: Uint8ClampedArray,
  w: number,
  h: number,
  radius: number,
): Uint8ClampedArray {
  if (radius <= 0) return src;
  const tmp = new Uint8ClampedArray(src.length);
  const out = new Uint8ClampedArray(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let minv = 255;
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        if (nx < 0 || nx >= w) {
          minv = 0;
          break;
        }
        minv = Math.min(minv, src[(y * w + nx) * 4]);
      }
      const i = (y * w + x) * 4;
      tmp[i] = tmp[i + 1] = tmp[i + 2] = minv;
      tmp[i + 3] = 255;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let minv = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) {
          minv = 0;
          break;
        }
        minv = Math.min(minv, tmp[(ny * w + x) * 4]);
      }
      const i = (y * w + x) * 4;
      out[i] = out[i + 1] = out[i + 2] = minv;
      out[i + 3] = 255;
    }
  }
  return out;
}

/** Morphological close — fills shard gaps without net outward growth. */
function closeMaskRgba(
  src: Uint8ClampedArray,
  w: number,
  h: number,
  radius: number,
): Uint8ClampedArray {
  if (radius <= 0) return src;
  return erodeMaskRgba(dilateMaskRgba(src, w, h, radius), w, h, radius);
}

/**
 * Close border shards then refuse new silk territory.
 * Keeps continuous strips; never claims main-saree / skin / blouse cores.
 */
function exclusiveBorderPaintMask(
  borderMask: Uint8ClampedArray,
  w: number,
  h: number,
  exclude: Array<Uint8ClampedArray | null>,
  closeRadius = 3,
): Uint8ClampedArray {
  const closed = closeMaskRgba(borderMask, w, h, closeRadius);
  const out = new Uint8ClampedArray(closed.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const orig = borderMask[i] / 255;
      let v = closed[i];
      // Hole-fill only: allow closed pixels near original border
      if (v > 0 && orig < 0.12) {
        // Keep if within closed band of a real border seed (already true via close),
        // but drop if a strong exclusive region owns the texel.
        for (const ex of exclude) {
          if (!ex) continue;
          if (ex[i] / 255 > 0.4) {
            v = 0;
            break;
          }
        }
      }
      // Always drop strong exclusive cores even on original seeds that overlap badly
      if (v > 0) {
        for (const ex of exclude) {
          if (!ex) continue;
          if (ex[i] / 255 > 0.55 && orig < 0.25) {
            v = 0;
            break;
          }
        }
      }
      out[i] = out[i + 1] = out[i + 2] = v;
      out[i + 3] = 255;
    }
  }
  return out;
}

/**
 * Fill small gaps along each atlas row/col inside a border strip.
 * Only bridges spans shorter than maxSpan so silk fields stay clean.
 */
function fillBorderStripGaps(
  mask: Uint8ClampedArray,
  w: number,
  h: number,
  exclude: Array<Uint8ClampedArray | null>,
  maxSpan: number,
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(mask);
  const blocked = (i: number) => {
    for (const ex of exclude) {
      if (ex && ex[i] / 255 > 0.42) return true;
    }
    return false;
  };
  // Horizontal bridges
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      while (x < w && mask[(y * w + x) * 4] < 40) x++;
      if (x >= w) break;
      const start = x;
      while (x < w && mask[(y * w + x) * 4] >= 40) x++;
      const end = x - 1;
      // look ahead for next segment within maxSpan
      let n = x;
      while (n < w && mask[(y * w + n) * 4] < 40) n++;
      if (n < w && n - end - 1 > 0 && n - end - 1 <= maxSpan) {
        let ok = true;
        for (let gx = end + 1; gx < n; gx++) {
          if (blocked((y * w + gx) * 4)) {
            ok = false;
            break;
          }
        }
        if (ok) {
          for (let gx = end + 1; gx < n; gx++) {
            const i = (y * w + gx) * 4;
            out[i] = out[i + 1] = out[i + 2] = 255;
            out[i + 3] = 255;
          }
        }
      }
      void start;
    }
  }
  // Vertical bridges
  for (let x = 0; x < w; x++) {
    let y = 0;
    while (y < h) {
      while (y < h && mask[(y * w + x) * 4] < 40) y++;
      if (y >= h) break;
      while (y < h && mask[(y * w + x) * 4] >= 40) y++;
      const end = y - 1;
      let n = y;
      while (n < h && mask[(n * w + x) * 4] < 40) n++;
      if (n < h && n - end - 1 > 0 && n - end - 1 <= maxSpan) {
        let ok = true;
        for (let gy = end + 1; gy < n; gy++) {
          if (blocked((gy * w + x) * 4)) {
            ok = false;
            break;
          }
        }
        if (ok) {
          for (let gy = end + 1; gy < n; gy++) {
            const i = (gy * w + x) * 4;
            out[i] = out[i + 1] = out[i + 2] = 255;
            out[i + 3] = 255;
          }
        }
      }
    }
  }
  return out;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Rec.709 luma from 8-bit sRGB channels. */
function luma8(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Plain-silk recolor: selected hex = hue; baseline luma = folds/detail only.
 * NEVER blends original chroma (that is RED×BLUE contamination).
 */
function silkRgbFromLuma(
  tr: number,
  tg: number,
  tb: number,
  baseR: number,
  baseG: number,
  baseB: number,
): [number, number, number] {
  const L = luma8(baseR, baseG, baseB);
  // Wider luma range keeps fold depth closer to the original atlas
  const t = Math.min(1, Math.max(0, (L - 0.04) / 0.62));
  const shade = 0.4 + 0.88 * Math.pow(t, 0.82);
  // Subtle local weave noise from baseline (no chroma bleed)
  const grain = 0.94 + 0.12 * ((baseR + baseG + baseB) / (3 * 255) - L);
  return [
    Math.min(255, Math.round(tr * shade * grain)),
    Math.min(255, Math.round(tg * shade * grain)),
    Math.min(255, Math.round(tb * shade * grain)),
  ];
}

/** True yellow-gold / copper zari only — NOT orange/red woven fabric art. */
function isGoldZariAlbedo(r: number, g: number, b: number): boolean {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const luma = 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
  // Yellow-gold: G almost as high as R (ratio ≥ 0.72), clearly above B
  if (
    rn > 0.45 &&
    gn > 0.4 &&
    bn < 0.4 &&
    gn / rn >= 0.72 &&
    rn - gn < 0.18 &&
    gn > bn + 0.12 &&
    luma > 0.4
  ) {
    return true;
  }
  return false;
}

/** Copper / antique-gold / orange-copper woven border (this atlas’s zari). */
function isCopperBorderAlbedo(r: number, g: number, b: number): boolean {
  if (isGoldZariAlbedo(r, g, b)) return true;
  if (isLikelySkinTone(r, g, b)) return false;
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const luma = 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
  // Yellow-copper
  if (
    rn > 0.35 &&
    gn > 0.28 &&
    bn < 0.28 &&
    rn >= gn &&
    gn > bn + 0.06 &&
    gn / Math.max(rn, 1e-6) >= 0.7 &&
    rn - gn < 0.22 &&
    rn - bn > 0.12 &&
    luma > 0.28 &&
    luma < 0.75
  ) {
    return true;
  }
  // Orange-copper woven border (MASTER_SAREE atlas characteristic)
  if (
    rn > 0.4 &&
    gn > 0.12 &&
    bn < 0.3 &&
    rn > gn * 1.25 &&
    gn >= bn &&
    gn / Math.max(rn, 1e-6) >= 0.28 &&
    gn / Math.max(rn, 1e-6) < 0.72 &&
    luma > 0.18 &&
    luma < 0.72
  ) {
    return true;
  }
  return false;
}

/**
 * Face / hands / lips albedo — must never be recolored as silk.
 * Orange woven fabric has very low B; skin/lips keep healthier G+B.
 */
function isLikelySkinTone(r: number, g: number, b: number): boolean {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const sat = Math.max(rn, gn, bn) - Math.min(rn, gn, bn);
  // Hot orange / deep crimson woven fabric — B collapsed
  if (bn < 0.09 && gn < rn * 0.5) return false;
  if (rn > 0.45 && gn < 0.16 && bn < 0.14) return false;
  // Broad flesh (any ethnicity midtones)
  if (
    rn > 0.15 &&
    gn > 0.1 &&
    bn > 0.08 &&
    gn / Math.max(rn, 1e-6) > 0.4 &&
    bn / Math.max(rn, 1e-6) > 0.2 &&
    sat < 0.58 &&
    rn + gn + bn > 0.35
  ) {
    return true;
  }
  // Lips / blush: R dominant but G≈B and neither channel collapsed
  if (
    rn > 0.22 &&
    gn > 0.1 &&
    bn > 0.1 &&
    Math.abs(gn - bn) < 0.14 &&
    gn / Math.max(rn, 1e-6) > 0.28 &&
    sat < 0.62
  ) {
    return true;
  }
  return false;
}

/** Warm red/orange base fabric (not gold, not skin) — must lose hue. */
function isWarmBaseFabric(r: number, g: number, b: number): boolean {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const sat = Math.max(rn, gn, bn) - Math.min(rn, gn, bn);
  if (isGoldZariAlbedo(r, g, b)) return false;
  if (isLikelySkinTone(r, g, b)) return false;
  // Crimson / orange woven fabric — R leads; allow slightly higher B in midtones
  if (
    rn > 0.18 &&
    rn >= gn * 0.92 &&
    rn > bn * 1.12 &&
    bn < 0.4 &&
    sat > 0.08 &&
    gn < 0.58
  ) {
    return true;
  }
  return false;
}

/** Red/crimson base fabric that must lose its hue on plain-silk recolor. */
function isCrimsonSilkAlbedo(r: number, g: number, b: number): boolean {
  return isWarmBaseFabric(r, g, b);
}

function emptyRegistry(): RegionRegistry {
  return {
    skin: [],
    hair: [],
    accessories: [],
    blouse: [],
    mainSaree: [],
    border: [],
    pallu: [],
    palluBorder: [],
    zari: [],
  };
}

function sourceSize(img: CanvasImageSource): { w: number; h: number } {
  const any = img as HTMLImageElement & HTMLCanvasElement & ImageBitmap;
  const w = any.naturalWidth || any.width || 1024;
  const h = any.naturalHeight || any.height || 1024;
  return { w, h };
}

export class SareeMaterialController {
  readonly root: THREE.Object3D;
  readonly regions: RegionRegistry;
  readonly baselineRoot: THREE.Object3D;
  private readonly originals = new Map<SlotKey, MaterialSnapshot>();
  private readonly masks: RegionMaskTextures;
  private workingCanvas: HTMLCanvasElement | null = null;
  private workingCtx: CanvasRenderingContext2D | null = null;
  private baseImageData: ImageData | null = null;
  private tintTexture: THREE.CanvasTexture | null = null;
  private targetMaterial: THREE.MeshStandardMaterial | null = null;
  private targetSlot: SlotKey | null = null;
  private maskCache = new Map<THREE.Texture, Uint8ClampedArray>();
  debugRegionsEnabled = false;
  /** Pure B/W: white = border UV mask, black = everything else. */
  debugBorderMaskEnabled = false;
  /** Optional single-region B/W debug: mainSaree | pallu | palluBorder | zari | border */
  debugSoloMask: null | 'mainSaree' | 'pallu' | 'palluBorder' | 'zari' | 'border' =
    null;
  /** Edit-model guide: saree=blue, border=gold on the live mesh. */
  assignPreviewEnabled = false;
  /**
   * When true (after user paints parts on the Meshy model), Colour / Border / …
   * follow painted UV masks only — no heuristic red-silk flood outside them.
   */
  strictAssignMasks = false;
  /** 'final' | 'original' | 'selected' — dev-only albedo preview */
  debugMaterialView: 'final' | 'original' | 'selected' = 'final';

  private customization = {
    saree: null as string | null,
    border: null as string | null,
    borderStyle: null as string | null,
    borderZariHex: null as string | null,
    pallu: null as string | null,
    palluBorder: null as string | null,
    blouse: null as string | null,
    zari: null as string | null,
  };

  private constructor(
    root: THREE.Object3D,
    regions: RegionRegistry,
    masks: RegionMaskTextures,
  ) {
    this.root = root;
    this.baselineRoot = root;
    this.regions = regions;
    this.masks = masks;
  }

  static prepare(
    root: THREE.Object3D,
    options?: { masks?: RegionMaskTextures },
  ): SareeMaterialController {
    const regions = emptyRegistry();
    const masks = options?.masks ?? {};

    // Clone materials so DoubleSide / map swaps never mutate the GLTF cache.
    // Keep authored Meshy hard normals — no computeVertexNormals / no smooth shading.
    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.castShadow = true;
      obj.receiveShadow = true;
      obj.frustumCulled = true;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      const cloned = mats.map((m) => {
        if (!m) return m;
        const c = m.clone();
        c.side = THREE.DoubleSide;
        c.needsUpdate = true;
        return c;
      });
      obj.material = Array.isArray(obj.material) ? cloned : cloned[0];
      cloned.forEach((_m, materialIndex) => {
        const slot = { mesh: obj, materialIndex };
        // CASE-D: one mesh / one material — regions resolved via UV masks.
        regions.mainSaree.push(slot);
        regions.border.push(slot);
        regions.pallu.push(slot);
        regions.palluBorder.push(slot);
        regions.blouse.push(slot);
        regions.zari.push(slot);
        regions.skin.push(slot);
        regions.hair.push(slot);
      });
    });

    // Masks must share glTF UV orientation (flipY=false).
    Object.values(masks).forEach((tex) => {
      if (!tex) return;
      tex.flipY = false;
      tex.colorSpace = THREE.NoColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
    });

    const controller = new SareeMaterialController(root, regions, masks);
    controller.captureOriginals();
    return controller;
  }

  private captureOriginals(): void {
    this.root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m, i) => {
        const std = m && asStandard(m);
        if (!std) return;
        this.originals.set(slotKey(obj, i), {
          color: std.color.clone(),
          map: std.map,
          roughness: std.roughness,
          metalness: std.metalness,
          material: std,
        });
        if (!std.map) return;
        const onMainCloth = isSareeBaseMesh(obj);
        if (onMainCloth || !this.targetMaterial) {
          this.targetMaterial = std;
          this.targetSlot = slotKey(obj, i);
        }
      });
    });
  }

  private hasAnyCustomization(): boolean {
    const c = this.customization;
    return !!(
      c.saree ||
      c.border ||
      c.borderStyle ||
      c.pallu ||
      c.palluBorder ||
      c.blouse ||
      c.zari ||
      this.debugRegionsEnabled ||
      this.debugBorderMaskEnabled ||
      this.debugSoloMask ||
      this.assignPreviewEnabled ||
      this.debugMaterialView !== 'final'
    );
  }

  setDebugMaterialView(view: 'final' | 'original' | 'selected'): void {
    this.debugMaterialView = view;
    this.rebuildAlbedo();
  }

  /** Call after interactive UV region assign paints into CanvasTexture masks. */
  refreshAfterMaskEdit(): void {
    this.maskCache.clear();
    this.rebuildAlbedo();
  }

  private ensureWorkingBuffer(): boolean {
    if (this.workingCanvas && this.baseImageData) return true;
    const mat = this.targetMaterial;
    const img = mat?.map?.image as CanvasImageSource | undefined;
    if (!mat || !img) return false;

    const { w, h } = sourceSize(img);
    this.workingCanvas = imageToCanvas(img, w, h);
    this.workingCtx = this.workingCanvas.getContext('2d', { willReadFrequently: true });
    if (!this.workingCtx) return false;
    this.baseImageData = this.workingCtx.getImageData(0, 0, w, h);

    this.tintTexture = new THREE.CanvasTexture(this.workingCanvas);
    this.tintTexture.colorSpace = THREE.SRGBColorSpace;
    this.tintTexture.flipY = mat.map!.flipY;
    this.tintTexture.wrapS = mat.map!.wrapS;
    this.tintTexture.wrapT = mat.map!.wrapT;
    // Keep mipmaps off so tinted silk doesn't bleed into skin
    this.tintTexture.generateMipmaps = false;
    this.tintTexture.minFilter = THREE.LinearFilter;
    this.tintTexture.magFilter = THREE.LinearFilter;
    this.tintTexture.needsUpdate = true;

    mat.map = this.tintTexture;
    mat.needsUpdate = true;
    this.pushTintToMainModel();
    return true;
  }

  /** The edited atlas must show on the saree cloth, not only the first mapped mesh. */
  private pushTintToMainModel(): void {
    if (!this.tintTexture) return;
    this.root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh) || !isSareeBaseMesh(obj)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        const std = m && asStandard(m);
        if (!std) continue;
        if (std.map !== this.tintTexture) std.map = this.tintTexture;
        std.needsUpdate = true;
      }
    });
  }

  private maskPixels(tex: THREE.Texture | null | undefined): Uint8ClampedArray | null {
    if (!tex || !this.baseImageData) return null;
    const img = tex.image as CanvasImageSource | undefined;
    if (!img) return null;
    const w = this.baseImageData.width;
    const h = this.baseImageData.height;

    // Editable CanvasTexture masks change in place — never serve a stale cache.
    if (img instanceof HTMLCanvasElement) {
      const c = imageToCanvas(img, w, h);
      return c.getContext('2d')!.getImageData(0, 0, w, h).data;
    }

    const cached = this.maskCache.get(tex);
    if (cached) return cached;
    const c = imageToCanvas(img, w, h);
    const data = c.getContext('2d')!.getImageData(0, 0, w, h).data;
    this.maskCache.set(tex, data);
    return data;
  }

  private restoreBaselineMap(): void {
    if (!this.targetSlot || !this.targetMaterial) return;
    const snap = this.originals.get(this.targetSlot);
    if (!snap?.map) return;
    this.targetMaterial.map = snap.map;
    this.targetMaterial.color.copy(snap.color);
    this.targetMaterial.roughness = snap.roughness;
    this.targetMaterial.metalness = snap.metalness;
    this.targetMaterial.needsUpdate = true;
    this.workingCanvas = null;
    this.workingCtx = null;
    this.baseImageData = null;
    if (this.tintTexture) {
      this.tintTexture.dispose();
      this.tintTexture = null;
    }
  }

  private rebuildAlbedo(): void {
    if (!this.hasAnyCustomization()) {
      this.restoreBaselineMap();
      return;
    }
    if (!this.ensureWorkingBuffer()) return;
    if (!this.workingCtx || !this.baseImageData || !this.tintTexture) return;

    const { width: w, height: h } = this.baseImageData;
    const out = new ImageData(new Uint8ClampedArray(this.baseImageData.data), w, h);
    const px = out.data;

    const skin = this.maskPixels(this.masks.skin);
    const saree = this.maskPixels(this.masks.mainSaree);
    const border = this.maskPixels(this.masks.border);
    const pallu = this.maskPixels(this.masks.pallu);
    const palluBorder = this.maskPixels(this.masks.palluBorder);
    const blouse = this.maskPixels(this.masks.blouse);
    const zari = this.maskPixels(this.masks.zari);

    const base = this.baseImageData.data;

    // Continuous exclusive border strips (UV masks only — never orange albedo)
    const borderExclude = [skin, saree, blouse, pallu] as Array<
      Uint8ClampedArray | null
    >;
    const borderActive = !!(
      this.customization.borderStyle || this.customization.border
    );
    const borderPaint = border
      ? borderActive
        ? fillBorderStripGaps(
            exclusiveBorderPaintMask(border, w, h, borderExclude, 3),
            w,
            h,
            borderExclude,
            12,
          )
        : exclusiveBorderPaintMask(border, w, h, borderExclude, 2)
      : null;
    const palluBorderPaint = palluBorder
      ? borderActive
        ? fillBorderStripGaps(
            exclusiveBorderPaintMask(palluBorder, w, h, borderExclude, 3),
            w,
            h,
            borderExclude,
            12,
          )
        : exclusiveBorderPaintMask(palluBorder, w, h, borderExclude, 2)
      : null;

    /** Border / zari / pallu-border strength (0–1). */
    const decorStrength = (x: number, y: number): number => {
      const b = borderPaint ? sampleMask(borderPaint, w, h, x, y) : 0;
      const pb = palluBorderPaint
        ? sampleMask(palluBorderPaint, w, h, x, y)
        : 0;
      const z = zari ? sampleMask(zari, w, h, x, y) : 0;
      return Math.max(b, pb, z);
    };

    /**
     * Full hue replace for plain silk — luminance/detail only from baseline.
     * Never preserves original orange/red/gold chroma.
     */
    const tintSilkRegion = (
      mask: Uint8ClampedArray | null,
      hex: string | null,
      coreMask: Uint8ClampedArray | null = null,
    ) => {
      if (!hex || !mask) return;
      const [tr, tg, tb] = hexToRgb(hex);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const br = base[i];
          const bg = base[i + 1];
          const bb = base[i + 2];

          const silkM = sampleMask(mask, w, h, x, y);
          if (silkM < 0.05) continue;

          const coreM = coreMask ? sampleMask(coreMask, w, h, x, y) : silkM;
          // Border pass owns strong border texels — skip only those
          const bOwn = borderPaint ? sampleMask(borderPaint, w, h, x, y) : 0;
          const pbOwn = palluBorderPaint
            ? sampleMask(palluBorderPaint, w, h, x, y)
            : 0;
          if (Math.max(bOwn, pbOwn) > 0.28) continue;

          if (isLikelySkinTone(br, bg, bb)) continue;

          const skinM = skin ? sampleMask(skin, w, h, x, y) : 0;
          if (coreM < 0.08 && skinM > 0.2 && !isWarmBaseFabric(br, bg, bb)) {
            continue;
          }

          const [nr, ng, nb] = silkRgbFromLuma(tr, tg, tb, br, bg, bb);
          px[i] = nr;
          px[i + 1] = ng;
          px[i + 2] = nb;
        }
      }
    };

    /**
     * Kill leftover original orange/red/gold hue everywhere that is not skin.
     * Runs AFTER silk tint, BEFORE border replace — so border orange becomes
     * silk temporarily, then border material overwrites the border mask.
     */
    const stripOriginalWarmHue = (hex: string) => {
      const [tr, tg, tb] = hexToRgb(hex);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          if (skin && sampleMask(skin, w, h, x, y) > 0.18) continue;
          const br = base[i];
          const bg = base[i + 1];
          const bb = base[i + 2];
          if (isLikelySkinTone(br, bg, bb)) continue;
          const pr = px[i];
          const pg = px[i + 1];
          const pbch = px[i + 2];
          const warmBase =
            isWarmBaseFabric(br, bg, bb) ||
            isCopperBorderAlbedo(br, bg, bb) ||
            isGoldZariAlbedo(br, bg, bb);
          const warmOut =
            isWarmBaseFabric(pr, pg, pbch) ||
            isCopperBorderAlbedo(pr, pg, pbch) ||
            isGoldZariAlbedo(pr, pg, pbch);
          if (!warmBase && !warmOut) continue;
          const [nr, ng, nb] = silkRgbFromLuma(tr, tg, tb, br, bg, bb);
          px[i] = nr;
          px[i + 1] = ng;
          px[i + 2] = nb;
        }
      }
    };

    const tintMetalRegion = (
      mask: Uint8ClampedArray | null,
      hex: string | null,
    ) => {
      if (!mask || !hex) return;
      const [tr, tg, tb] = hexToRgb(hex);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          if (skin && sampleMask(skin, w, h, x, y) > 0.2) continue;
          const m = sampleMask(mask, w, h, x, y);
          if (m < 0.28) continue;
          // Never tint metal onto plain silk body (weak fringe)
          if (saree && sampleMask(saree, w, h, x, y) > 0.55 && m < 0.4) continue;
          const br = base[i];
          const bg = base[i + 1];
          const bb = base[i + 2];
          if (isLikelySkinTone(br, bg, bb) && m < 0.5) continue;
          // Region replace — do not keep orange atlas chroma
          const L = 0.5 + 0.35 * m + 0.15 * (luma8(br, bg, bb) / 255);
          const metal = 0.6 + L * 0.4;
          px[i] = Math.min(255, Math.round(tr * metal));
          px[i + 1] = Math.min(255, Math.round(tg * metal));
          px[i + 2] = Math.min(255, Math.round(tb * metal));
        }
      }
    };

    /**
     * Paint border design ONLY inside SAREE_BORDER / PALLU_BORDER UV masks.
     * Region-driven: ignores original orange/copper albedo entirely.
     * Hard clamp: never write into skin / blouse; refuse weak fringe on silk/pallu.
     */
    const paintBorderDesign = (
      mask: Uint8ClampedArray | null,
      style: string | null,
      borderHex: string | null,
      zariHex: string,
    ) => {
      if (!mask || !style || !borderHex) return;

      const [fr, fg, fb] = hexToRgb(borderHex);
      const [zr, zg, zb] = hexToRgb(zariHex);
      const pat = borderPatternImageData(style, borderHex, zariHex);
      const pw = pat.width;
      const ph = pat.height;
      const pd = pat.data;
      const period = 36;

      const rowMin = new Int32Array(h).fill(w);
      const rowMax = new Int32Array(h).fill(-1);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (sampleMask(mask, w, h, x, y) < 0.25) continue;
          if (x < rowMin[y]) rowMin[y] = x;
          if (x > rowMax[y]) rowMax[y] = x;
        }
      }

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const coreM = sampleMask(mask, w, h, x, y);
          // Hard region gate — no orange-albedo fallback
          if (coreM < 0.28) continue;

          if (skin && sampleMask(skin, w, h, x, y) > 0.2) continue;
          if (blouse && sampleMask(blouse, w, h, x, y) > 0.55 && coreM < 0.45) {
            continue;
          }
          // Weak fringe into silk/pallu body — refuse; strong border core always paints
          if (saree && sampleMask(saree, w, h, x, y) > 0.55 && coreM < 0.4) {
            continue;
          }
          if (pallu && sampleMask(pallu, w, h, x, y) > 0.55 && coreM < 0.4) {
            continue;
          }

          const i = (y * w + x) * 4;
          const br = base[i];
          const bg = base[i + 1];
          const bb = base[i + 2];
          if (isLikelySkinTone(br, bg, bb) && coreM < 0.5) continue;

          const span = Math.max(1, rowMax[y] - rowMin[y]);
          const across =
            rowMax[y] >= 0 ? (x - rowMin[y]) / span : 0.5;
          const along = (y + x * 0.12) / period;
          const sx = ((Math.floor((along % 1) * pw) % pw) + pw) % pw;
          const sy = Math.min(
            ph - 1,
            Math.max(0, Math.floor(Math.min(1, Math.max(0, across)) * (ph - 1))),
          );
          const pi = (sy * pw + sx) * 4;
          const fieldL = (fr + fg + fb) / 3;
          const patL = (pd[pi] + pd[pi + 1] + pd[pi + 2]) / 3;
          const motif = Math.min(
            1,
            Math.max(0, (patL - fieldL * 0.75) / Math.max(28, 255 - fieldL * 0.75)),
          );

          // Shade from mask strength + mild weave, NOT from orange atlas chroma
          const L = 0.45 + 0.35 * coreM + 0.2 * (luma8(br, bg, bb) / 255);
          const metalShade = 0.62 + L * 0.4;
          const outR = (fr * (1 - motif) + zr * motif) * metalShade;
          const outG = (fg * (1 - motif) + zg * motif) * metalShade;
          const outB = (fb * (1 - motif) + zb * motif) * metalShade;
          px[i] = Math.min(255, Math.round(outR));
          px[i + 1] = Math.min(255, Math.round(outG));
          px[i + 2] = Math.min(255, Math.round(outB));
        }
      }
    };

    const paintFlatSilk = (mask: Uint8ClampedArray | null, hex: string | null) => {
      if (!hex || !mask) return;
      const core = mask;
      const dilated = dilateMaskRgba(mask, w, h, 10);
      const [tr, tg, tb] = hexToRgb(hex);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const br = base[i];
          const bg = base[i + 1];
          const bb = base[i + 2];
          if (sampleMask(dilated, w, h, x, y) < 0.08) continue;
          const coreM = sampleMask(core, w, h, x, y);
          const decorM = decorStrength(x, y);
          if (decorM > 0.28) {
            if (isGoldZariAlbedo(br, bg, bb) || coreM < 0.12) continue;
          }
          if (isLikelySkinTone(br, bg, bb)) continue;
          const skinM = skin ? sampleMask(skin, w, h, x, y) : 0;
          if (coreM < 0.08 && skinM > 0.15 && !isWarmBaseFabric(br, bg, bb)) {
            continue;
          }
          px[i] = tr;
          px[i + 1] = tg;
          px[i + 2] = tb;
        }
      }
    };

    const paintSoloBw = (mask: Uint8ClampedArray | null, thr = 0.28) => {
      for (let i = 0; i < px.length; i += 4) {
        px[i] = 0;
        px[i + 1] = 0;
        px[i + 2] = 0;
        px[i + 3] = 255;
      }
      if (!mask) return;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (sampleMask(mask, w, h, x, y) < thr) continue;
          const i = (y * w + x) * 4;
          px[i] = px[i + 1] = px[i + 2] = 255;
        }
      }
    };

    if (this.debugBorderMaskEnabled) {
      // WHITE = border / palluBorder UV mask, BLACK = everything else
      paintSoloBw(null);
      const paintWhite = (mask: Uint8ClampedArray | null, thr = 0.28) => {
        if (!mask) return;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (sampleMask(mask, w, h, x, y) < thr) continue;
            const i = (y * w + x) * 4;
            px[i] = px[i + 1] = px[i + 2] = 255;
          }
        }
      };
      paintWhite(borderPaint ?? border);
      paintWhite(palluBorderPaint ?? palluBorder);
    } else if (this.debugSoloMask) {
      const solo =
        this.debugSoloMask === 'mainSaree'
          ? saree
          : this.debugSoloMask === 'pallu'
            ? pallu
            : this.debugSoloMask === 'palluBorder'
              ? palluBorderPaint ?? palluBorder
              : this.debugSoloMask === 'zari'
                ? zari
                : borderPaint ?? border;
      paintSoloBw(solo);
    } else if (this.debugMaterialView === 'original') {
      // Baseline albedo already copied into px — skip tint passes
    } else if (this.debugMaterialView === 'selected') {
      const hex = this.customization.saree;
      if (hex) {
        paintFlatSilk(saree, hex);
        paintFlatSilk(pallu, this.customization.pallu ?? hex);
        paintFlatSilk(blouse, this.customization.blouse ?? hex);
      }
    } else if (this.assignPreviewEnabled) {
      // Live assign guide: paint saree blue + border gold so labeling is obvious.
      const paintGuide = (
        mask: Uint8ClampedArray | null,
        r: number,
        g: number,
        b: number,
        threshold = 0.12,
      ) => {
        if (!mask) return;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const m = sampleMask(mask, w, h, x, y);
            if (m < threshold) continue;
            // Only hide skin when this guide mask is weak — never hide user paint.
            if (skin && sampleMask(skin, w, h, x, y) > 0.55 && m < 0.35) continue;
            const i = (y * w + x) * 4;
            const br = base[i];
            const bg = base[i + 1];
            const bb = base[i + 2];
            if (isLikelySkinTone(br, bg, bb) && m < 0.4) continue;
            const L = luma8(br, bg, bb);
            // Keep weave shading but push a clear solid blue / gold read.
            const shade = 0.62 + L * 0.48;
            const a = Math.min(1, m * 1.15);
            px[i] = Math.min(255, Math.round(r * shade * a + px[i] * (1 - a)));
            px[i + 1] = Math.min(255, Math.round(g * shade * a + px[i + 1] * (1 - a)));
            px[i + 2] = Math.min(255, Math.round(b * shade * a + px[i + 2] * (1 - a)));
          }
        }
      };
      // Main saree body → vivid blue (primary). Pallu/blouse only if painted apart.
      paintGuide(saree, 18, 72, 196);
      paintGuide(blouse, 160, 70, 140);
      paintGuide(pallu, 20, 160, 170);
      paintGuide(border, 212, 168, 48);
      paintGuide(palluBorder, 240, 200, 64);
      paintGuide(zari, 255, 243, 176);
    } else if (this.debugRegionsEnabled) {
      const paint = (
        mask: Uint8ClampedArray | null,
        r: number,
        g: number,
        b: number,
      ) => {
        if (!mask) return;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const m = sampleMask(mask, w, h, x, y);
            if (m < 0.2) continue;
            px[i] = Math.round(px[i] * 0.2 + r * m);
            px[i + 1] = Math.round(px[i + 1] * 0.2 + g * m);
            px[i + 2] = Math.round(px[i + 2] * 0.2 + b * m);
          }
        }
      };
      paint(saree, 40, 90, 220);
      paint(border, 230, 190, 40);
      paint(pallu, 20, 180, 180);
      paint(palluBorder, 255, 140, 0);
      paint(blouse, 200, 80, 160);
      paint(zari, 255, 245, 180);
      paint(skin, 80, 200, 120);
    } else {
      // REGION → MATERIAL replace (not blend with original orange texture)
      // 1) Main/pallu silk  2) Strip all warm base hue  3) Border REPLACE  4) Zari
      const silkHex = this.customization.saree;
      if (silkHex) {
        const combined = new Uint8ClampedArray(w * h * 4);
        const addMask = (mask: Uint8ClampedArray | null) => {
          if (!mask) return;
          for (let i = 0; i < combined.length; i += 4) {
            if (mask[i] > combined[i]) {
              combined[i] = mask[i];
              combined[i + 1] = mask[i];
              combined[i + 2] = mask[i];
              combined[i + 3] = 255;
            }
          }
        };
        // Saved main saree mask is the colour target. Pallu/blouse only if painted.
        addMask(saree);
        if (!this.strictAssignMasks) {
          if (!this.customization.pallu) addMask(pallu);
          if (this.customization.blouse) addMask(blouse);
        } else {
          if (this.customization.pallu) addMask(pallu);
          if (this.customization.blouse) addMask(blouse);
        }
        const dilateR = this.strictAssignMasks ? 1 : 14;
        const dilated = dilateMaskRgba(combined, w, h, dilateR);
        tintSilkRegion(dilated, silkHex, combined);
        if (this.customization.pallu) {
          const palluDilated = dilateMaskRgba(
            pallu!,
            w,
            h,
            this.strictAssignMasks ? 1 : 10,
          );
          tintSilkRegion(palluDilated, this.customization.pallu, pallu);
        }
        // Non-strict: strip leftover warm atlas hue so gaps don't stay red.
        // Strict (saved map): NEVER flood silk colour outside painted main saree.
        if (!this.strictAssignMasks) {
          stripOriginalWarmHue(silkHex);
        }
      }

      // Border REPLACE — original texture under these texels is discarded
      if (this.customization.borderStyle && this.customization.border) {
        const zariAccent =
          this.customization.borderZariHex ?? this.customization.border;
        paintBorderDesign(
          borderPaint,
          this.customization.borderStyle,
          this.customization.border,
          zariAccent,
        );
        paintBorderDesign(
          palluBorderPaint,
          this.customization.borderStyle,
          this.customization.palluBorder ?? this.customization.border,
          zariAccent,
        );
      } else {
        tintMetalRegion(borderPaint ?? border, this.customization.border);
        tintMetalRegion(
          palluBorderPaint ?? palluBorder,
          this.customization.palluBorder,
        );
      }
      tintMetalRegion(zari, this.customization.zari);

      // Final purge: only when masks are not user-authored — otherwise colour
      // must stay inside the saved main-saree (blue) region only.
      if (silkHex && !this.strictAssignMasks) {
        const [tr, tg, tb] = hexToRgb(silkHex);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            if (skin && sampleMask(skin, w, h, x, y) > 0.18) continue;
            const inBorder = Math.max(
              borderPaint ? sampleMask(borderPaint, w, h, x, y) : 0,
              palluBorderPaint ? sampleMask(palluBorderPaint, w, h, x, y) : 0,
            );
            const inZari = zari ? sampleMask(zari, w, h, x, y) : 0;
            if (inBorder > 0.28 || inZari > 0.35) continue;
            const r = px[i];
            const g = px[i + 1];
            const b = px[i + 2];
            if (isLikelySkinTone(r, g, b)) continue;
            if (
              !isWarmBaseFabric(r, g, b) &&
              !isCopperBorderAlbedo(r, g, b) &&
              !isGoldZariAlbedo(r, g, b)
            ) {
              continue;
            }
            const [nr, ng, nb] = silkRgbFromLuma(
              tr,
              tg,
              tb,
              base[i],
              base[i + 1],
              base[i + 2],
            );
            px[i] = nr;
            px[i + 1] = ng;
            px[i + 2] = nb;
          }
        }
      }
    }

    this.workingCtx.putImageData(out, 0, 0);
    this.tintTexture.needsUpdate = true;
    if (this.targetMaterial) this.targetMaterial.needsUpdate = true;
    this.pushTintToMainModel();
  }

  applySareeColor(hex: string | null): void {
    this.customization.saree = hex;
    this.rebuildAlbedo();
  }

  applyBorderColor(hex: string | null): void {
    this.customization.border = hex;
    this.rebuildAlbedo();
  }

  /** Apply woven border motif (temple / mysore / …) into border UV masks. */
  applyBorderDesign(
    style: string | null,
    borderHex: string | null,
    zariHex: string | null = null,
  ): void {
    this.customization.borderStyle = style;
    this.customization.border = borderHex;
    this.customization.borderZariHex = zariHex;
    if (borderHex && !this.customization.palluBorder) {
      this.customization.palluBorder = borderHex;
    }
    this.rebuildAlbedo();
  }

  applyPalluColor(hex: string | null): void {
    this.customization.pallu = hex;
    this.rebuildAlbedo();
  }

  applyPalluBorderColor(hex: string | null): void {
    this.customization.palluBorder = hex;
    this.rebuildAlbedo();
  }

  applyBlouseColor(hex: string | null): void {
    this.customization.blouse = hex;
    this.rebuildAlbedo();
  }

  applyZariColor(hex: string | null): void {
    this.customization.zari = hex;
    this.rebuildAlbedo();
  }

  resetCustomization(): void {
    this.customization = {
      saree: null,
      border: null,
      borderStyle: null,
      borderZariHex: null,
      pallu: null,
      palluBorder: null,
      blouse: null,
      zari: null,
    };
    this.debugRegionsEnabled = false;
    this.debugBorderMaskEnabled = false;
    this.debugSoloMask = null;
    this.assignPreviewEnabled = false;
    this.debugMaterialView = 'final';
    this.restoreBaselineMap();
  }

  enableRegionDebug(): void {
    this.debugRegionsEnabled = true;
    this.debugBorderMaskEnabled = false;
    this.debugSoloMask = null;
    this.assignPreviewEnabled = false;
    this.rebuildAlbedo();
  }

  disableRegionDebug(): void {
    this.debugRegionsEnabled = false;
    this.rebuildAlbedo();
  }

  setDebugRegions(enabled: boolean): void {
    if (enabled) this.enableRegionDebug();
    else this.disableRegionDebug();
  }

  /** Pure B/W border mask verification (WHITE=border, BLACK=not). */
  setDebugBorderMask(enabled: boolean): void {
    this.debugBorderMaskEnabled = enabled;
    if (enabled) {
      this.debugRegionsEnabled = false;
      this.debugSoloMask = null;
      this.assignPreviewEnabled = false;
    }
    this.rebuildAlbedo();
  }

  setDebugSoloMask(
    which: null | 'mainSaree' | 'pallu' | 'palluBorder' | 'zari' | 'border',
  ): void {
    this.debugSoloMask = which;
    if (which) {
      this.debugBorderMaskEnabled = false;
      this.debugRegionsEnabled = false;
      this.assignPreviewEnabled = false;
    }
    this.rebuildAlbedo();
  }

  /** Saree→blue / Border→gold live guide while assigning regions. */
  setAssignPreview(enabled: boolean): void {
    this.assignPreviewEnabled = enabled;
    if (enabled) {
      this.debugRegionsEnabled = false;
      this.debugBorderMaskEnabled = false;
      this.debugSoloMask = null;
    }
    this.rebuildAlbedo();
  }

  /** Painted masks become the only source of truth for Colour / Border / … */
  setStrictAssignMasks(enabled: boolean, rebuild = true): void {
    if (this.strictAssignMasks === enabled) {
      if (rebuild) this.rebuildAlbedo();
      return;
    }
    this.strictAssignMasks = enabled;
    if (rebuild) this.rebuildAlbedo();
  }

  inspectModel(): void {
    const rows: unknown[] = [];
    this.root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const mats = Array.isArray(object.material)
        ? object.material
        : [object.material];
      const g = object.geometry;
      rows.push({
        name: object.name,
        parent: object.parent?.name,
        geometry: {
          vertices: g.attributes.position?.count,
          indices: g.index?.count,
          uv: g.attributes.uv?.count ?? 0,
          normal: g.attributes.normal?.count ?? 0,
          color: !!g.attributes.color,
          groups: g.groups,
        },
        material: mats.map((m, index) => {
          const std = m && asStandard(m);
          return {
            index,
            name: m?.name,
            type: m?.type,
            color: std?.color?.getHexString?.(),
            map: !!std?.map,
            normalMap: !!std?.normalMap,
            roughnessMap: !!std?.roughnessMap,
            metalnessMap: !!std?.metalnessMap,
          };
        }),
      });
    });
    console.info(
      [
        '==========================',
        'KSIC BASELINE / REGION INSPECT',
        '==========================',
        'MODE: CASE-D single mesh + atlas (OPTION C UV masks)',
        `MESHES: ${rows.length}`,
        ...rows.map((r) => JSON.stringify(r)),
      ].join('\n'),
    );
  }

  debugPrint(): void {
    this.inspectModel();
  }
}

let activeController: SareeMaterialController | null = null;

export function registerMaterialController(c: SareeMaterialController | null): void {
  activeController = c;
}

export function getMaterialController(): SareeMaterialController | null {
  return activeController;
}

export function installSareeDebugGlobals(): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & {
    debugSareeModel?: () => void;
    debugSareeRegions?: boolean;
    debugSareeMaterial?: boolean;
    debugSareeMaterialView?: 'final' | 'original' | 'selected';
    debugSareeColor?: boolean;
    enableRegionDebug?: () => void;
    disableRegionDebug?: () => void;
    resetSareeCustomization?: () => void;
    applySareeColorDebug?: (hex: string) => void;
    __ksicDebugState?: () => unknown;
    __ksicMaterialPreview?: () => unknown;
  };

  Object.defineProperty(w, 'debugSareeColor', {
    configurable: true,
    enumerable: true,
    get() {
      return activeController?.debugMaterialView === 'selected';
    },
    set(v: boolean) {
      activeController?.setDebugMaterialView(v ? 'selected' : 'final');
      if (v && activeController) {
        const c = activeController as unknown as {
          baseImageData: ImageData | null;
          workingCanvas: HTMLCanvasElement | null;
          customization: { saree: string | null };
          masks: RegionMaskTextures;
        };
        const base = c.baseImageData;
        const canvas = c.workingCanvas;
        if (base && canvas && c.customization.saree) {
          const [tr, tg, tb] = hexToRgb(c.customization.saree);
          const ctx = canvas.getContext('2d')!;
          const fin = ctx.getImageData(0, 0, base.width, base.height).data;
          const samples: unknown[] = [];
          const step = Math.floor(base.width / 8);
          for (let y = step; y < base.height; y += step) {
            for (let x = step; x < base.width; x += step) {
              const i = (y * base.width + x) * 4;
              const or = base.data[i];
              const og = base.data[i + 1];
              const ob = base.data[i + 2];
              if (!isCrimsonSilkAlbedo(or, og, ob)) continue;
              samples.push({
                uv: [+(x / base.width).toFixed(2), +(y / base.height).toFixed(2)],
                originalRGB: [or, og, ob],
                luminance: +luma8(or, og, ob).toFixed(3),
                selectedRGB: [tr, tg, tb],
                finalRGB: [fin[i], fin[i + 1], fin[i + 2]],
              });
              if (samples.length >= 8) break;
            }
            if (samples.length >= 8) break;
          }
          console.info('[KSIC] debugSareeColor samples', samples);
        }
      }
      console.info(`[KSIC] debugSareeColor = ${!!v}`);
    },
  });

  Object.defineProperty(w, 'debugSareeMaterialView', {
    configurable: true,
    enumerable: true,
    get() {
      return activeController?.debugMaterialView ?? 'final';
    },
    set(v: 'final' | 'original' | 'selected') {
      activeController?.setDebugMaterialView(v);
      console.info(`[KSIC] debugSareeMaterialView = ${v}`);
    },
  });

  Object.defineProperty(w, 'debugSareeMaterial', {
    configurable: true,
    enumerable: true,
    get() {
      return activeController?.debugMaterialView !== 'final';
    },
    set(v: boolean) {
      activeController?.setDebugMaterialView(v ? 'selected' : 'final');
      console.info(
        `[KSIC] debugSareeMaterial = ${!!v} (view=${v ? 'selected' : 'final'}; set debugSareeMaterialView to 'original' | 'selected' | 'final')`,
      );
    },
  });

  w.__ksicMaterialPreview = () => {
    const c = activeController as unknown as {
      baseImageData: ImageData | null;
      workingCanvas: HTMLCanvasElement | null;
      customization: { saree: string | null };
      debugMaterialView: string;
    } | null;
    if (!c?.baseImageData) return null;
    const view = c.debugMaterialView;
    const orig = document.createElement('canvas');
    orig.width = c.baseImageData.width;
    orig.height = c.baseImageData.height;
    orig.getContext('2d')!.putImageData(c.baseImageData, 0, 0);
    return {
      view,
      selectedHex: c.customization.saree,
      original: orig.toDataURL('image/png'),
      final: c.workingCanvas?.toDataURL('image/png') ?? null,
    };
  };

  Object.defineProperty(w, 'debugSareeRegions', {
    configurable: true,
    enumerable: true,
    get() {
      return !!activeController?.debugRegionsEnabled;
    },
    set(v: boolean) {
      activeController?.setDebugRegions(!!v);
      console.info(`[KSIC] debugSareeRegions = ${!!v}`);
    },
  });

  /** Alias — multi-color region false-color pass. */
  Object.defineProperty(w, 'debugBorderRegion', {
    configurable: true,
    enumerable: true,
    get() {
      return !!activeController?.debugRegionsEnabled;
    },
    set(v: boolean) {
      activeController?.setDebugRegions(!!v);
      console.info(
        `[KSIC] debugBorderRegion = ${!!v} (main=blue, border=yellow, pallu=teal, palluBorder=orange, blouse=pink, zari=cream, skin=green)`,
      );
    },
  });

  /**
   * Mandatory border verification: WHITE = border UV mask, BLACK = everything else.
   * Usage: debugBorderMask(true)  /  debugBorderMask(false)
   */
  (w as Window & { debugBorderMask?: (on?: boolean) => boolean }).debugBorderMask = (
    on?: boolean,
  ) => {
    const next = on === undefined ? !activeController?.debugBorderMaskEnabled : !!on;
    activeController?.setDebugBorderMask(next);
    console.info(
      `[KSIC] debugBorderMask = ${next} — WHITE=border/palluBorder mask, BLACK=not border`,
    );
    return next;
  };

  const soloDebug =
    (which: 'mainSaree' | 'pallu' | 'palluBorder' | 'zari' | 'border') =>
    (on?: boolean) => {
      const cur = activeController?.debugSoloMask === which;
      const next = on === undefined ? !cur : !!on;
      activeController?.setDebugSoloMask(next ? which : null);
      console.info(`[KSIC] debug${which}Mask = ${next} (WHITE=region, BLACK=rest)`);
      return next;
    };
  (w as Window & { debugMainSareeMask?: (on?: boolean) => boolean }).debugMainSareeMask =
    soloDebug('mainSaree');
  (w as Window & { debugPalluMask?: (on?: boolean) => boolean }).debugPalluMask =
    soloDebug('pallu');
  (w as Window & { debugPalluBorderMask?: (on?: boolean) => boolean }).debugPalluBorderMask =
    soloDebug('palluBorder');
  (w as Window & { debugZariMask?: (on?: boolean) => boolean }).debugZariMask =
    soloDebug('zari');

  Object.defineProperty(w, 'debugBorderMaskEnabled', {
    configurable: true,
    enumerable: true,
    get() {
      return !!activeController?.debugBorderMaskEnabled;
    },
    set(v: boolean) {
      activeController?.setDebugBorderMask(!!v);
      console.info(`[KSIC] debugBorderMaskEnabled = ${!!v}`);
    },
  });

  (w as Window & { borderInspector?: () => void }).borderInspector = () => {
    const c = activeController;
    const report = {
      glbConclusion:
        'THE CURRENT GLB DOES NOT CONTAIN A RELIABLE BORDER REGION (separate mesh/material/group).',
      mesh: 'SareeCloth (single mesh, single material, TEXCOORD_0 atlas)',
      borderMeshes: [] as string[],
      borderMaterialSlots: [] as string[],
      borderGeometryGroups: [] as string[],
      borderUV: 'YES — shared TEXCOORD_0 with all regions',
      borderMask: c?.masks.border ? 'YES — /models/region_border.png (UV grayscale)' : 'NO',
      palluBorderMask: c?.masks.palluBorder
        ? 'YES — /models/region_pallu_border.png'
        : 'NO',
      zariMask: c?.masks.zari ? 'YES — /models/region_zari.png' : 'NO',
      pipeline: 'UV mask → border design/color (not orange albedo detection)',
      verify: 'Run debugBorderMask(true) — expect continuous white strips, not speckles',
      assetPrep:
        'For ground-truth borders: author region_border.png in /saree-segmentation.html or split meshes in Blender (SAREE_BORDER).',
    };
    console.info('[KSIC] BORDER INSPECTOR', report);
    console.warn(report.glbConclusion);
    return report;
  };

  w.enableRegionDebug = () => activeController?.enableRegionDebug();
  w.disableRegionDebug = () => activeController?.disableRegionDebug();
  w.debugSareeModel = () => activeController?.inspectModel();
  w.resetBorder = () => {
    activeController?.applyBorderDesign(null, null, null);
    activeController?.applyPalluBorderColor(null);
    console.info('[KSIC] resetBorder() — border design/color cleared');
  };
  w.resetSareeCustomization = () => activeController?.resetCustomization();
  w.applySareeColorDebug = (hex: string | null) =>
    activeController?.applySareeColor(hex);
  (w as Window & {
    applyBorderDesignDebug?: (
      style: string | null,
      borderHex: string | null,
      zariHex?: string | null,
    ) => void;
  }).applyBorderDesignDebug = (style, borderHex, zariHex = '#E8C547') => {
    activeController?.applyBorderDesign(style, borderHex, zariHex);
    if (borderHex) activeController?.applyPalluBorderColor(borderHex);
    console.info('[KSIC] applyBorderDesignDebug', { style, borderHex, zariHex });
  };
  (w as Window & { __ksicTintStats?: () => unknown }).__ksicTintStats = () => {
    const c = activeController as unknown as {
      workingCanvas: HTMLCanvasElement | null;
      baseImageData: ImageData | null;
      masks: RegionMaskTextures;
      maskPixels: (tex: THREE.Texture | null | undefined) => Uint8ClampedArray | null;
    } | null;
    if (!c?.workingCanvas || !c.baseImageData) return null;
    const { width: tw, height: th } = c.baseImageData;
    const ctx = c.workingCanvas.getContext('2d')!;
    const data = ctx.getImageData(0, 0, tw, th).data;
    const base = c.baseImageData.data;
    const saree = c.maskPixels(c.masks.mainSaree);
    const border = c.maskPixels(c.masks.border);
    const pallu = c.maskPixels(c.masks.pallu);
    const blouse = c.maskPixels(c.masks.blouse);
    const zari = c.maskPixels(c.masks.zari);
    const skin = c.maskPixels(c.masks.skin);
    let blueish = 0;
    let reddish = 0;
    let total = 0;
    let warmBaseStill = 0;
    let warmInSilk = 0;
    let warmInDecor = 0;
    let warmInSkin = 0;
    let warmOutside = 0;
    const warmSkinSamples: number[][] = [];
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r + g + b < 20) continue;
      total++;
      if (b > r + 15 && b > g) blueish++;
      if (r > b + 20 && r > g) reddish++;
      const px = i / 4;
      const x = px % tw;
      const y = Math.floor(px / tw);
      const br = base[i];
      const bg = base[i + 1];
      const bb = base[i + 2];
      if (!isWarmBaseFabric(br, bg, bb)) continue;
      // Still warm in OUTPUT?
      if (!(r > b + 15 && r > g)) continue;
      warmBaseStill++;
      const silkM = Math.max(
        saree ? saree[i] / 255 : 0,
        pallu ? pallu[i] / 255 : 0,
        blouse ? blouse[i] / 255 : 0,
      );
      const decorM = Math.max(
        border ? border[i] / 255 : 0,
        zari ? zari[i] / 255 : 0,
      );
      const skinM = skin ? skin[i] / 255 : 0;
      if (silkM > 0.05) warmInSilk++;
      else if (decorM > 0.28) warmInDecor++;
      else if (skinM > 0.1) {
        warmInSkin++;
        if (warmSkinSamples.length < 12) {
          warmSkinSamples.push([br, bg, bb, r, g, b]);
        }
      } else warmOutside++;
    }
    return {
      blueishPct: total ? +((100 * blueish) / total).toFixed(2) : 0,
      reddishPct: total ? +((100 * reddish) / total).toFixed(2) : 0,
      sampled: total,
      warmBaseStill,
      warmInSilk,
      warmInDecor,
      warmInSkin,
      warmOutside,
      warmSkinSamples,
    };
  };
  w.__ksicDebugState = () => {
    if (!activeController) return null;
    const out: unknown[] = [];
    let mapKind: string | null = null;
    let mapFlip: boolean | null = null;
    activeController.root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      out.push({
        name: obj.name,
        materials: mats.map((m) => {
          const std = asStandard(m!);
          if (std?.map) {
            mapKind = std.map.constructor.name;
            mapFlip = std.map.flipY;
          }
          return {
            name: m?.name,
            color: std?.color?.getHexString?.(),
            map: !!std?.map,
            mapType: std?.map?.constructor?.name,
          };
        }),
      });
    });
    return {
      meshes: out,
      customization: (activeController as unknown as { customization: unknown })
        .customization,
      debugRegions: activeController.debugRegionsEnabled,
      mapKind,
      mapFlip,
      hasWorkingBuffer: !!(activeController as unknown as { workingCanvas: unknown })
        .workingCanvas,
    };
  };
}
