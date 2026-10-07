import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  BLOUSES,
  BORDER_COLORS,
  COLORS,
  HERO_MODEL_PATH,
  REGION_MASK_PATHS,
  ZARIS,
} from '../../data/catalog';
import { borderTextureOf } from '../../data/borders';
import { useCustomizerStore } from '../../store/customizerStore';
import {
  installSareeDebugGlobals,
  registerMaterialController,
  SareeMaterialController,
} from '../../engine/materialCustomization';
import { RegionAssignSession, clampBrushRadius } from '../../engine/regionAssign';
import { registerRegionAssignApi } from '../../engine/regionAssignBridge';
import { isSareeBaseMesh } from '../../engine/sareeBaseMaterial';
import { applyShadeFactor, shadeDepth } from '../../engine/materialEngine';
import { FixedDrapeStandIn } from './FixedDrapeStandIn';

const _worldNormal = new THREE.Vector3();

/** Prefer cloth front-faces; paint every fold layer under the cursor (UV islands). */
function collectPaintHits(
  hits: THREE.Intersection[],
  rayDir: THREE.Vector3,
): THREE.Intersection[] {
  const usable = hits.filter((h) => {
    if (!h.uv) return false;
    if (!(h.object instanceof THREE.Mesh)) return false;
    if (h.object.name === 'studio-floor') return false;
    return true;
  });
  if (!usable.length) return [];

  const score = (h: THREE.Intersection): number => {
    const mesh = h.object as THREE.Mesh;
    let s = 0;
    const name = mesh.name.toLowerCase();
    if (isSareeBaseMesh(mesh)) s += 120;
    if (name.includes('saree') || name.includes('cloth')) s += 80;
    if (name.includes('blouse')) s += 20;
    if (name.includes('body') || name.includes('female') || name.includes('skin')) {
      s -= 50;
    }
    if (name.includes('hair')) s -= 70;
    if (h.face) {
      _worldNormal.copy(h.face.normal).transformDirection(mesh.matrixWorld);
      // Front-facing toward the camera ray
      s += _worldNormal.dot(rayDir) < 0 ? 40 : -25;
    }
    s -= h.distance * 0.5;
    return s;
  };

  usable.sort((a, b) => score(b) - score(a));
  const primary = usable[0];
  const band = 0.05; // paint stacked folds within 5 cm along the ray
  const out: THREE.Intersection[] = [];
  for (const h of usable) {
    if (h.distance - primary.distance > band) continue;
    // Keep cloth-ranked hits; allow body only if nothing better in band
    const mesh = h.object as THREE.Mesh;
    const name = mesh.name.toLowerCase();
    const isBody =
      name.includes('body') || name.includes('female') || name.includes('skin');
    const isHair = name.includes('hair');
    if (isHair) continue;
    if (isBody && (isSareeBaseMesh(primary.object as THREE.Mesh) || score(primary) > score(h) + 30)) {
      continue;
    }
    out.push(h);
  }
  return out.length ? out : [primary];
}

function hexForColorId(id: string | null): string | null {
  if (id == null) return null;
  return COLORS.find((c) => c.id === id)?.hex ?? null;
}

function shadeHex(hex: string, factor: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, Math.round(((n >> 16) & 255) * factor)));
  const g = Math.min(255, Math.max(0, Math.round(((n >> 8) & 255) * factor)));
  const b = Math.min(255, Math.max(0, Math.round((n & 255) * factor)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function blouseHex(blouseId: string | null, sareeHex: string): string | null {
  if (!blouseId) return null;
  const item = BLOUSES.find((b) => b.id === blouseId);
  if (!item) return null;
  if (item.material === 'fixed' && item.hex) return item.hex;
  if (item.material === 'matching') return sareeHex;
  if (item.material === 'darker') return shadeHex(sareeHex, 0.72);
  if (item.material === 'lighter') return shadeHex(sareeHex, 1.18);
  if (item.material === 'contrast') return shadeHex(sareeHex, 0.55);
  return sareeHex;
}

/**
 * Same dress update as “make your own saree”:
 * silk colour only, blouse follows it, woven border stays until that step.
 */
function renderConfigurationOnModel(controller: SareeMaterialController): void {
  const state = useCustomizerStore.getState();
  const base = hexForColorId(state.color);
  const sareeHex = base ? applyShadeFactor(base, shadeDepth(state.shade)) : null;
  controller.applySareeColor(sareeHex, false);

  if (sareeHex) {
    const nextBlouse =
      !state.blouse || state.blouse === 'matching'
        ? sareeHex
        : blouseHex(state.blouse, sareeHex);
    controller.applyBlouseColor(nextBlouse, false);
  } else {
    controller.applyBlouseColor(null, false);
  }

  const onBorder =
    state.step === 'border' ||
    state.step === 'pallu' ||
    state.step === 'zari' ||
    state.step === 'finish';
  if (onBorder && state.border) {
    const hex = BORDER_COLORS.find((c) => c.id === state.borderColor)?.hex ?? '#B8963E';
    const zariFromStep =
      state.step === 'zari' || state.step === 'finish'
        ? ZARIS.find((x) => x.id === state.zari)?.hex
        : null;
    const zariAccent =
      zariFromStep && zariFromStep.toLowerCase() !== hex.toLowerCase()
        ? zariFromStep
        : state.borderColor === 'pure-gold'
          ? '#FFF3B0'
          : '#E8C547';
    controller.applyBorderDesign(borderTextureOf(state.border), hex, zariAccent, false);
    controller.applyPalluBorderColor(hex, false);
  } else {
    controller.applyBorderDesign(null, null, null, false);
    controller.applyPalluBorderColor(null, false);
  }

  const onZari = state.step === 'zari' || state.step === 'finish';
  controller.applyZariColor(
    onZari ? (ZARIS.find((x) => x.id === state.zari)?.hex ?? null) : null,
    false,
  );
  controller.commitAppearance();
}

/**
 * CASE-D hero: single mesh + atlas.
 * Edit-model mode paints UV region assignments (Border / Saree / …).
 */
function HeroGlb({ url }: { url: string }) {
  const { scene } = useGLTF(url, false);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const controllerRef = useRef<SareeMaterialController | null>(null);
  const assignRef = useRef<RegionAssignSession | null>(null);
  const paintingRef = useRef(false);
  const authoredKey = useRef<string | null>(null);
  const mapOnRef = useRef(false);
  const rebuildRafRef = useRef(0);
  const baseMasksRef = useRef<Parameters<typeof RegionAssignSession.create>[0] | null>(
    null,
  );

  const color = useCustomizerStore((s) => s.color);
  const shade = useCustomizerStore((s) => s.shade);
  const step = useCustomizerStore((s) => s.step);
  const border = useCustomizerStore((s) => s.border);
  const borderColor = useCustomizerStore((s) => s.borderColor);
  const pallu = useCustomizerStore((s) => s.pallu);
  const blouse = useCustomizerStore((s) => s.blouse);
  const zari = useCustomizerStore((s) => s.zari);
  const modelEditMode = useCustomizerStore((s) => s.modelEditMode);
  const assignBrush = useCustomizerStore((s) => s.assignBrush);
  const assignBrushRadius = useCustomizerStore((s) => s.assignBrushRadius);
  const bumpAssignRevision = useCustomizerStore((s) => s.bumpAssignRevision);

  const brushRef = useRef(assignBrush);
  const brushRadiusRef = useRef(assignBrushRadius);
  brushRef.current = assignBrush;
  brushRadiusRef.current = assignBrushRadius;

  const [
    maskSkin,
    maskHair,
    maskMain,
    maskBorder,
    maskPallu,
    maskPalluBorder,
    maskBlouse,
    maskZari,
  ] = useTexture([
    REGION_MASK_PATHS.skin,
    REGION_MASK_PATHS.hair,
    REGION_MASK_PATHS.mainSaree,
    REGION_MASK_PATHS.border,
    REGION_MASK_PATHS.pallu,
    REGION_MASK_PATHS.palluBorder,
    REGION_MASK_PATHS.blouse,
    REGION_MASK_PATHS.zari,
  ]);

  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    installSareeDebugGlobals();

    const baseMasks = {
      skin: maskSkin,
      hair: maskHair,
      mainSaree: maskMain,
      border: maskBorder,
      pallu: maskPallu,
      palluBorder: maskPalluBorder,
      blouse: maskBlouse,
      zari: maskZari,
    };
    baseMasksRef.current = baseMasks;

    const session = RegionAssignSession.create(baseMasks);
    assignRef.current = session;

    const controller = SareeMaterialController.prepare(clone, {
      masks: session.asMaskTextures(),
    });
    controllerRef.current = controller;
    registerMaterialController(controller);

    void session.hydratePersisted().then((ok) => {
      if (!ok) return;
      controller.setStrictAssignMasks(true, false);
      invalidate();
    });

    registerRegionAssignApi({
      reset: () => {
        const base = baseMasksRef.current;
        const s = assignRef.current;
        if (!base || !s) return;
        void s.revertUnsaved(base).then((result) => {
          const c = controllerRef.current;
          if (result === 'saved') {
            c?.setStrictAssignMasks(true, false);
            useCustomizerStore.setState({
              toast: 'Unsaved paint discarded — last Save restored',
            });
          } else if (result === 'base') {
            c?.setStrictAssignMasks(false, false);
            useCustomizerStore.setState({
              toast: 'Unsaved paint cleared — nothing was saved yet',
            });
          } else {
            useCustomizerStore.setState({ toast: 'Nothing to discard — map matches Save' });
            return;
          }
          c?.refreshAfterMaskEdit();
          bumpAssignRevision();
          invalidate();
        });
      },
      save: () => {
        assignRef.current?.persist();
        const saved = controllerRef.current;
        saved?.setAssignPreview(false);
        saved?.setStrictAssignMasks(true, false);
        if (saved) renderConfigurationOnModel(saved);
        useCustomizerStore.setState({
          toast: 'Map saved — Colour renders only on your main saree',
        });
        invalidate();
      },
      toggleMap: () => {
        mapOnRef.current = !mapOnRef.current;
        const c = controllerRef.current;
        if (!c) return;
        if (mapOnRef.current) {
          c.setDebugRegions(true);
        } else {
          c.setDebugRegions(false);
          c.setAssignPreview(false);
          renderConfigurationOnModel(c);
        }
        invalidate();
      },
      getMapOn: () => mapOnRef.current,
    });

    return () => {
      registerRegionAssignApi(null);
      assignRef.current?.dispose();
      assignRef.current = null;
      controllerRef.current = null;
      registerMaterialController(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clone,
    invalidate,
    maskSkin,
    maskHair,
    maskMain,
    maskBorder,
    maskPallu,
    maskPalluBorder,
    maskBlouse,
    maskZari,
  ]);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;
    const key = JSON.stringify({
      color,
      shade,
      border,
      borderColor,
      pallu,
      blouse,
      zari,
      step,
    });
    // The GLB already carries the finished saree. Repaint only after a real change.
    if (authoredKey.current === null || authoredKey.current === key) {
      authoredKey.current = key;
      return;
    }
    controller.setAssignPreview(false);
    renderConfigurationOnModel(controller);
    invalidate();
  }, [color, shade, border, borderColor, pallu, blouse, zari, step, invalidate]);

  useEffect(() => {
    if (!modelEditMode) {
      paintingRef.current = false;
      gl.domElement.style.cursor = '';
      if (mapOnRef.current) {
        mapOnRef.current = false;
        controllerRef.current?.setDebugRegions(false);
      }
      const session = assignRef.current;
      const controller = controllerRef.current;
      if (session?.isDirty()) session.persist();
      controller?.setLivePaint(false);
      controller?.setAssignPreview(false);
      controller?.setStrictAssignMasks(!!session?.hasUserEdits(), false);
      if (controller && session?.hasUserEdits()) renderConfigurationOnModel(controller);
      invalidate();
      return;
    }

    // Round brush cursor (not the default + crosshair).
    gl.domElement.style.cursor =
      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'9\' fill=\'none\' stroke=\'%23183A72\' stroke-width=\'2\'/%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'1.5\' fill=\'%23183A72\'/%3E%3C/svg%3E") 12 12, cell';
    mapOnRef.current = false;
    const entering = controllerRef.current;
    entering?.setLivePaint(false);
    entering?.setAssignPreview(false);
    entering?.setStrictAssignMasks(
      !!assignRef.current?.hasUserEdits() || !!assignRef.current?.hasSavedCheckpoint(),
      false,
    );

    // Double-side cloth so paint rays still hit when the camera is tight on folds.
    const sideRestore: Array<{ mat: THREE.Material; side: THREE.Side }> = [];
    clone.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      if (!isSareeBaseMesh(obj) && !/saree|cloth|blouse/i.test(obj.name)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of mats) {
        if (!mat || !('side' in mat)) continue;
        sideRestore.push({ mat, side: mat.side });
        mat.side = THREE.DoubleSide;
        mat.needsUpdate = true;
      }
    });
    invalidate();

    const canvas = gl.domElement;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const schedulePreviewRebuild = () => {
      if (rebuildRafRef.current) return;
      rebuildRafRef.current = requestAnimationFrame(() => {
        rebuildRafRef.current = 0;
        const controller = controllerRef.current;
        if (!controller) return;
        controller.setLivePaint(true);
        controller.setAssignPreview(false);
        renderConfigurationOnModel(controller);
        invalidate();
      });
    };

    const paintAtClient = (clientX: number, clientY: number) => {
      const session = assignRef.current;
      if (!session) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(clone, true);
      const paintHits = collectPaintHits(hits, raycaster.ray.direction);
      if (!paintHits.length) return;
      const radius = clampBrushRadius(brushRadiusRef.current);
      const brush = brushRef.current;
      let painted = false;
      for (const hit of paintHits) {
        if (!hit.uv) continue;
        session.paintAtUv(hit.uv.x, hit.uv.y, brush, radius);
        painted = true;
      }
      if (!painted) return;
      controllerRef.current?.setStrictAssignMasks(true, false);
      schedulePreviewRebuild();
    };

    const activePointers = new Set<number>();

    const endPaintStroke = () => {
      if (!paintingRef.current) return;
      paintingRef.current = false;
      if (rebuildRafRef.current) {
        cancelAnimationFrame(rebuildRafRef.current);
        rebuildRafRef.current = 0;
      }
      const controller = controllerRef.current;
      const session = assignRef.current;
      controller?.setLivePaint(false);
      controller?.setAssignPreview(false);
      controller?.setStrictAssignMasks(true, false);
      if (controller) renderConfigurationOnModel(controller);
      if (session?.isDirty()) {
        window.setTimeout(() => session.persist(), 250);
      }
      bumpAssignRevision();
      invalidate();
    };

    const onDown = (ev: PointerEvent) => {
      // Left mouse / primary touch only — right-drag & 2-finger stay with orbit.
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      activePointers.add(ev.pointerId);

      if (activePointers.size >= 2) {
        // Hand off to OrbitControls for pinch-zoom / two-finger rotate.
        paintingRef.current = false;
        try {
          if (canvas.hasPointerCapture(ev.pointerId)) {
            canvas.releasePointerCapture(ev.pointerId);
          }
          for (const id of activePointers) {
            if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
          }
        } catch {
          /* ignore */
        }
        return;
      }

      paintingRef.current = true;
      try {
        canvas.setPointerCapture(ev.pointerId);
      } catch {
        /* ignore */
      }
      paintAtClient(ev.clientX, ev.clientY);
    };

    const onMove = (ev: PointerEvent) => {
      if (!paintingRef.current || activePointers.size >= 2) return;
      paintAtClient(ev.clientX, ev.clientY);
    };

    const onUp = (ev: PointerEvent) => {
      activePointers.delete(ev.pointerId);
      try {
        if (canvas.hasPointerCapture(ev.pointerId)) {
          canvas.releasePointerCapture(ev.pointerId);
        }
      } catch {
        /* ignore */
      }
      if (activePointers.size === 0) {
        endPaintStroke();
      }
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      paintingRef.current = false;
      activePointers.clear();
      for (const { mat, side } of sideRestore) {
        mat.side = side;
        mat.needsUpdate = true;
      }
      if (rebuildRafRef.current) {
        cancelAnimationFrame(rebuildRafRef.current);
        rebuildRafRef.current = 0;
      }
    };
  }, [modelEditMode, gl, invalidate, clone, camera, bumpAssignRevision]);

  return <primitive object={clone} position={[0, 0, 0]} scale={1} />;
}

useGLTF.preload(HERO_MODEL_PATH, false);

export function HeroModel3D({
  hasHeroModel,
  modelUrl = HERO_MODEL_PATH,
}: {
  hasHeroModel: boolean;
  modelUrl?: string;
}) {
  if (!hasHeroModel) return <FixedDrapeStandIn />;
  return <HeroGlb url={modelUrl} />;
}
