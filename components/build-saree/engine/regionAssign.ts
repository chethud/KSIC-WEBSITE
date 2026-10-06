/**
 * Interactive UV region assignment — paint Border / Saree / Pallu / … on the model.
 * Masks stay exclusive (one label per texel) and persist in localStorage.
 */
import * as THREE from 'three';
import type { RegionMaskTextures } from './materialCustomization';
import { clearRegionPickCache } from './regionPick';

export type AssignBrush =
  | 'mainSaree'
  | 'border'
  | 'pallu'
  | 'palluBorder'
  | 'blouse'
  | 'zari'
  | 'erase';

export const ASSIGN_BRUSHES: Array<{
  id: AssignBrush;
  label: string;
  hint: string;
}> = [
  { id: 'mainSaree', label: 'Saree', hint: 'Paints blue — main silk body' },
  { id: 'border', label: 'Border', hint: 'Paints gold — woven edge / temple band' },
  { id: 'pallu', label: 'Pallu', hint: 'Paints blue — pallu field' },
  { id: 'palluBorder', label: 'Pallu edge', hint: 'Paints gold — pallu border strip' },
  { id: 'blouse', label: 'Blouse', hint: 'Paints blue — blouse / torso silk' },
  { id: 'zari', label: 'Zari', hint: 'Paints light gold — fine zari lines' },
  { id: 'erase', label: 'Erase', hint: 'Clear assignment' },
];

export const BRUSH_RADIUS_MIN = 2;
export const BRUSH_RADIUS_MAX = 64;

/** Quick-pick brush sizes (atlas px radius). */
export const ASSIGN_BRUSH_SIZES: Array<{
  id: string;
  label: string;
  radius: number;
  hint: string;
}> = [
  { id: '2', label: '2', radius: 2, hint: 'Hairline detail' },
  { id: '4', label: '4', radius: 4, hint: 'Fine edges' },
  { id: '8', label: '8', radius: 8, hint: 'Thin border lines' },
  { id: '14', label: '14', radius: 14, hint: 'Normal bands' },
  { id: '22', label: '22', radius: 22, hint: 'Wide border' },
  { id: '32', label: '32', radius: 32, hint: 'Silk fill' },
  { id: '48', label: '48', radius: 48, hint: 'Large areas' },
  { id: '64', label: '64', radius: 64, hint: 'Broad fill' },
];

export type AssignBrushSize = (typeof ASSIGN_BRUSH_SIZES)[number]['id'];

export function clampBrushRadius(radius: number): number {
  return Math.min(
    BRUSH_RADIUS_MAX,
    Math.max(BRUSH_RADIUS_MIN, Math.round(radius)),
  );
}

export function radiusForBrushSize(size: AssignBrushSize | number): number {
  if (typeof size === 'number') return clampBrushRadius(size);
  return ASSIGN_BRUSH_SIZES.find((s) => s.id === size)?.radius ?? 14;
}

const PAINT_KEYS = [
  'mainSaree',
  'border',
  'pallu',
  'palluBorder',
  'blouse',
  'zari',
] as const;

export type PaintKey = (typeof PAINT_KEYS)[number];

/**
 * Exclusivity priority (high → low). Blue silk body is mainSaree;
 * pallu must not keep a duplicate of that blue mask.
 */
const EXCLUSIVE_PRIORITY: PaintKey[] = [
  'border',
  'palluBorder',
  'zari',
  'blouse',
  'mainSaree',
  'pallu',
];

const STORAGE_KEY = 'ksic-region-assign-v2';
const ATLAS = 1024;

type CanvasBag = Record<PaintKey, HTMLCanvasElement>;
type CtxBag = Record<PaintKey, CanvasRenderingContext2D>;
type TexBag = Record<PaintKey, THREE.CanvasTexture>;

function blankCanvas(size = ATLAS): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.clearRect(0, 0, size, size);
  return c;
}

function drawTexToCanvas(
  tex: THREE.Texture | null | undefined,
  canvas: HTMLCanvasElement,
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = tex?.image as CanvasImageSource | undefined;
  if (!img) return;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function uvToPixel(u: number, v: number, size: number): { x: number; y: number } {
  const uu = ((u % 1) + 1) % 1;
  const vv = ((v % 1) + 1) % 1;
  // glTF + Three flipY=false: V=0 → TOP row of the PNG / canvas (same as bake_semantic_regions).
  return {
    x: Math.min(size - 1, Math.max(0, Math.floor(uu * size))),
    y: Math.min(size - 1, Math.max(0, Math.floor(vv * size))),
  };
}

export class RegionAssignSession {
  readonly canvases: CanvasBag;
  readonly ctx: CtxBag;
  readonly textures: TexBag;
  private skin: THREE.Texture | null = null;
  private hair: THREE.Texture | null = null;
  private dirty = false;
  /** True after the user paints or a saved map loads — customize must follow masks. */
  private userEdited = false;
  brushRadius = 10;

  hasUserEdits(): boolean {
    return this.userEdited;
  }

  private constructor(canvases: CanvasBag, ctx: CtxBag, textures: TexBag) {
    this.canvases = canvases;
    this.ctx = ctx;
    this.textures = textures;
  }

  static create(base: RegionMaskTextures): RegionAssignSession {
    const canvases = {} as CanvasBag;
    const ctx = {} as CtxBag;
    const textures = {} as TexBag;
    for (const key of PAINT_KEYS) {
      const c = blankCanvas(ATLAS);
      drawTexToCanvas(base[key], c);
      canvases[key] = c;
      ctx[key] = c.getContext('2d', { willReadFrequently: true })!;
      const t = new THREE.CanvasTexture(c);
      t.flipY = false;
      t.colorSpace = THREE.NoColorSpace;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
      textures[key] = t;
    }
    const session = new RegionAssignSession(canvases, ctx, textures);
    session.skin = base.skin ?? null;
    session.hair = base.hair ?? null;
    session.loadPersisted();
    // Blue silk body → mainSaree only (drop baked pallu duplicates).
    session.claimBlueSilkAsMainSaree();
    session.enforceExclusivity();
    return session;
  }

  /**
   * Fold pallu texels into mainSaree so the blue guide on this model
   * is the main saree body (not a shared pallu copy).
   */
  claimBlueSilkAsMainSaree(): void {
    const main = this.ctx.mainSaree.getImageData(0, 0, ATLAS, ATLAS);
    const pallu = this.ctx.pallu.getImageData(0, 0, ATLAS, ATLAS);
    let moved = 0;
    for (let i = 0; i < main.data.length; i += 4) {
      if (pallu.data[i] > 40 && main.data[i] <= 40) {
        main.data[i] = main.data[i + 1] = main.data[i + 2] = 255;
        main.data[i + 3] = 255;
        moved++;
      }
      // Drop pallu wherever it overlaps or copied the blue silk body.
      if (pallu.data[i] > 40) {
        pallu.data[i] = pallu.data[i + 1] = pallu.data[i + 2] = 0;
        pallu.data[i + 3] = 0;
      }
    }
    this.ctx.mainSaree.putImageData(main, 0, 0);
    this.ctx.pallu.putImageData(pallu, 0, 0);
    this.textures.mainSaree.needsUpdate = true;
    this.textures.pallu.needsUpdate = true;
    if (moved > 0) {
      this.dirty = true;
      this.userEdited = true;
    }
    clearRegionPickCache();
  }

  /** One label per texel — higher priority keeps the stamp. */
  enforceExclusivity(): void {
    const images = EXCLUSIVE_PRIORITY.map((key) => ({
      key,
      img: this.ctx[key].getImageData(0, 0, ATLAS, ATLAS),
    }));
    for (let i = 0; i < images[0].img.data.length; i += 4) {
      let claimed = false;
      for (const { img } of images) {
        if (img.data[i] <= 40) continue;
        if (claimed) {
          img.data[i] = img.data[i + 1] = img.data[i + 2] = 0;
          img.data[i + 3] = 0;
        } else {
          claimed = true;
        }
      }
    }
    for (const { key, img } of images) {
      this.ctx[key].putImageData(img, 0, 0);
      this.textures[key].needsUpdate = true;
    }
    clearRegionPickCache();
  }

  asMaskTextures(): RegionMaskTextures {
    return {
      skin: this.skin,
      hair: this.hair,
      mainSaree: this.textures.mainSaree,
      border: this.textures.border,
      pallu: this.textures.pallu,
      palluBorder: this.textures.palluBorder,
      blouse: this.textures.blouse,
      zari: this.textures.zari,
    };
  }

  /** Stamp a circular brush at UV. Exclusive across paint keys. */
  paintAtUv(u: number, v: number, brush: AssignBrush, radius = this.brushRadius): boolean {
    const { x, y } = uvToPixel(u, v, ATLAS);
    const r = Math.max(1, Math.round(radius));

    if (brush === 'erase') {
      for (const key of PAINT_KEYS) {
        this.clearCircle(this.ctx[key], x, y, r);
        this.textures[key].needsUpdate = true;
      }
      this.dirty = true;
      this.userEdited = true;
      clearRegionPickCache();
      return true;
    }

    // Clear exclusivity under the stamp, then fill target
    for (const key of PAINT_KEYS) {
      this.clearCircle(this.ctx[key], x, y, r);
    }
    this.fillCircle(this.ctx[brush], x, y, r);
    for (const key of PAINT_KEYS) {
      this.textures[key].needsUpdate = true;
    }
    this.dirty = true;
    this.userEdited = true;
    clearRegionPickCache();
    return true;
  }

  /** Full wipe to baked masks (clears saved checkpoint). */
  resetFromBase(base: RegionMaskTextures, clearSaved = true): void {
    for (const key of PAINT_KEYS) {
      drawTexToCanvas(base[key], this.canvases[key]);
      this.textures[key].needsUpdate = true;
    }
    this.dirty = false;
    this.userEdited = false;
    clearRegionPickCache();
    if (clearSaved) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }

  hasSavedCheckpoint(): boolean {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  }

  isDirty(): boolean {
    return this.dirty;
  }

  /**
   * Discard only unsaved strokes — restore last Save.
   * If nothing was ever saved, restore baked masks (without wiping a future save).
   */
  async revertUnsaved(base: RegionMaskTextures): Promise<'saved' | 'base' | 'clean'> {
    if (!this.dirty && this.hasSavedCheckpoint()) {
      return 'clean';
    }
    if (this.hasSavedCheckpoint()) {
      const ok = await this.hydratePersisted();
      if (ok) {
        this.dirty = false;
        this.userEdited = true;
        clearRegionPickCache();
        return 'saved';
      }
    }
    // No checkpoint yet: drop this session’s paint only.
    this.resetFromBase(base, false);
    return 'base';
  }

  /** Commit current map as the Save checkpoint (keeps Reset from wiping it). */
  persist(): void {
    try {
      const payload: Record<string, string> = {};
      for (const key of PAINT_KEYS) {
        payload[key] = this.canvases[key].toDataURL('image/png');
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      this.dirty = false;
      this.userEdited = true;
    } catch {
      /* quota / private mode */
    }
  }

  private loadPersisted(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const payload = JSON.parse(raw) as Record<string, string>;
      let loaded = false;
      for (const key of PAINT_KEYS) {
        const url = payload[key];
        if (!url) continue;
        const img = new Image();
        // Sync decode via data URL is fine for 1k masks when already in memory —
        // use draw after decode in microtask if needed. Data URLs decode sync in practice.
        img.src = url;
        if (img.complete && img.naturalWidth > 0) {
          this.ctx[key].clearRect(0, 0, ATLAS, ATLAS);
          this.ctx[key].drawImage(img, 0, 0, ATLAS, ATLAS);
          this.textures[key].needsUpdate = true;
          loaded = true;
        }
      }
      if (loaded) {
        this.dirty = false;
        this.userEdited = true;
        this.claimBlueSilkAsMainSaree();
        this.enforceExclusivity();
        clearRegionPickCache();
      }
    } catch {
      /* ignore */
    }
  }

  /** Async hydrate from localStorage (images may not be sync-complete). */
  async hydratePersisted(): Promise<boolean> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const payload = JSON.parse(raw) as Record<string, string>;
      let loaded = false;
      await Promise.all(
        PAINT_KEYS.map(
          (key) =>
            new Promise<void>((resolve) => {
              const url = payload[key];
              if (!url) {
                resolve();
                return;
              }
              const img = new Image();
              img.onload = () => {
                this.ctx[key].clearRect(0, 0, ATLAS, ATLAS);
                this.ctx[key].drawImage(img, 0, 0, ATLAS, ATLAS);
                this.textures[key].needsUpdate = true;
                loaded = true;
                resolve();
              };
              img.onerror = () => resolve();
              img.src = url;
            }),
        ),
      );
      if (loaded) {
        this.userEdited = true;
        this.claimBlueSilkAsMainSaree();
        this.enforceExclusivity();
      }
      clearRegionPickCache();
      return loaded;
    } catch {
      return false;
    }
  }

  private fillCircle(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
  ): void {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    // Solid stamp so blue/gold preview updates clearly under the brush.
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + 0.5, cy + 0.5, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private clearCircle(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
  ): void {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx + 0.5, cy + 0.5, r + 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  dispose(): void {
    this.persist();
    for (const key of PAINT_KEYS) {
      this.textures[key].dispose();
    }
  }
}
