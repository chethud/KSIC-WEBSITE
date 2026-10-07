import { create } from 'zustand';
import type {
  CameraView,
  RenderMode,
  SareeConfiguration,
} from '../types/customization';
import { DEFAULT_CONFIGURATION } from '../data/catalog';
import { addBagItem } from '@/lib/bag';
import {
  buildCartPayload,
  buildShareUrl,
  restoreFromUrl,
  saveDesign,
} from '../engine/designStorage';

interface CustomizerStore extends SareeConfiguration {
  step: (typeof import('../data/catalog').STEPS)[number]['id'];
  cameraView: CameraView;
  renderMode: RenderMode;
  bagCount: number;
  toast: string | null;
  hoverRegion: 'none' | 'border' | 'pallu' | 'zari' | 'blouse';
  /** When true, clicking the 3D model selects/assigns a region. */
  modelEditMode: boolean;
  /** Brush used while Edit model is on — assign labels on the mesh. */
  assignBrush: import('../engine/regionAssign').AssignBrush;
  /** Paint stamp radius in atlas pixels (2–64). */
  assignBrushRadius: number;
  /** Bumps when masks are painted so UI can react. */
  assignRevision: number;

  setStep: (step: CustomizerStore['step']) => void;
  setCameraView: (view: CameraView) => void;
  setRenderMode: (mode: RenderMode) => void;
  setHoverRegion: (r: CustomizerStore['hoverRegion']) => void;
  setModelEditMode: (on: boolean) => void;
  toggleModelEditMode: () => void;
  setAssignBrush: (brush: CustomizerStore['assignBrush']) => void;
  setAssignBrushRadius: (radius: number) => void;
  bumpAssignRevision: () => void;
  update: (partial: Partial<SareeConfiguration>) => void;
  setDesignName: (designName: string) => void;
  saveCurrentDesign: () => string;
  shareCurrentDesign: () => string;
  addToBag: () => void;
  clearToast: () => void;
  bootstrap: () => void;
}

export const useCustomizerStore = create<CustomizerStore>((set, get) => ({
  ...DEFAULT_CONFIGURATION,
  step: 'colour',
  cameraView: 'front',
  renderMode: 'webgl',
  bagCount: 0,
  toast: null,
  hoverRegion: 'none',
  modelEditMode: false,
  assignBrush: 'mainSaree',
  assignBrushRadius: 14,
  assignRevision: 0,

  setStep: (step) => set({ step }),
  setCameraView: (cameraView) => set({ cameraView }),
  setRenderMode: (renderMode) => set({ renderMode }),
  setHoverRegion: (hoverRegion) => set({ hoverRegion }),
  setModelEditMode: (modelEditMode) =>
    set({
      modelEditMode,
      // Restore original full-body front framing when entering Edit model.
      cameraView: modelEditMode ? 'front' : get().cameraView,
      // Entering assign: blue silk body is the main saree brush by default.
      assignBrush: modelEditMode ? 'mainSaree' : get().assignBrush,
      toast: modelEditMode
        ? 'Blue = main saree body · gold = border — paint then Done'
        : 'Assignments saved — Colour & Border follow your painted parts',
      hoverRegion: modelEditMode ? get().hoverRegion : 'none',
    }),
  toggleModelEditMode: () => {
    const next = !get().modelEditMode;
    get().setModelEditMode(next);
  },
  setAssignBrush: (assignBrush) => set({ assignBrush }),
  setAssignBrushRadius: (radius) =>
    set({
      assignBrushRadius: Math.min(64, Math.max(2, Math.round(radius))),
    }),
  bumpAssignRevision: () => set({ assignRevision: get().assignRevision + 1 }),
  update: (partial) => set(partial),
  setDesignName: (designName) => set({ designName }),

  saveCurrentDesign: () => {
    const record = saveDesign(get());
    set({ designId: record.designId, toast: `Saved as ${record.designId}` });
    return record.designId;
  },

  shareCurrentDesign: () => {
    const id = get().designId ?? saveDesign(get()).designId;
    set({ designId: id });
    const url = buildShareUrl({ ...get(), designId: id });
    void navigator.clipboard?.writeText(url);
    set({ toast: 'Link copied' });
    return url;
  },

  addToBag: () => {
    const payload = buildCartPayload(get());
    addBagItem({
      id: payload.designId,
      name: payload.configuration.designName || 'Atelier saree',
      detail: 'Composed in the atelier',
      href: `/your-saree?design=${payload.designId}`,
      image: '/pdp/ivory-silk.jpg',
      price: payload.price,
    });
    set({
      designId: payload.designId,
      bagCount: get().bagCount + 1,
      toast: 'Added to bag',
    });
    window.dispatchEvent(
      new CustomEvent('ksic:add-to-bag', { detail: payload }),
    );
  },

  clearToast: () => set({ toast: null }),

  bootstrap: () => {
    set({
      ...DEFAULT_CONFIGURATION,
      step: 'colour',
      renderMode: 'webgl',
      cameraView: 'front',
      toast: null,
      hoverRegion: 'none',
      modelEditMode: false,
      assignBrush: 'border',
      assignBrushRadius: 14,
      assignRevision: 0,
    });
    const restored = restoreFromUrl();
    if (restored) {
      set({
        ...restored,
        step: 'colour',
        renderMode: 'webgl',
        color: restored.color ?? DEFAULT_CONFIGURATION.color,
        colorMode: restored.colorMode ?? 'single',
      });
    }
  },
}));
