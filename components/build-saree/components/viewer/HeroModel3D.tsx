import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  HERO_MODEL_PATH,
  REGION_MASK_PATHS,
} from '../../data/catalog';
import { useCustomizerStore } from '../../store/customizerStore';
import {
  installSareeDebugGlobals,
  registerMaterialController,
  SareeMaterialController,
} from '../../engine/materialCustomization';
import { RegionAssignSession, clampBrushRadius } from '../../engine/regionAssign';
import { registerRegionAssignApi } from '../../engine/regionAssignBridge';
import { isSareeBaseMesh } from '../../engine/sareeBaseMaterial';
import {
  applyShadeFactor,
  resolveMaterials,
  shadeDepth,
} from '../../engine/materialEngine';
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

/** Push the current colour / border / pallu / blouse / zari onto the live saree. */
function renderConfigurationOnModel(controller: SareeMaterialController): void {
  const state = useCustomizerStore.getState();
  const mats = resolveMaterials(state);
  const shaded = state.color
    ? applyShadeFactor(mats.sareeHex, shadeDepth(state.shade))
    : null;
  controller.applySareeColor(shaded);
  controller.applyPalluColor(state.pallu ? shaded : null);
  controller.applyBlouseColor(state.blouse ? mats.blouseHex : null);
  controller.applyZariColor(state.zari ? mats.zariHex : null);
  if (state.border) {
    controller.applyBorderDesign(state.border, mats.borderHex, mats.zariHex);
  } else {
    controller.applyBorderDesign(null, null, null);
    controller.applyPalluBorderColor(null);
  }
}

/**
 * CASE-D hero: single mesh + atlas.
 * Edit-model mode paints UV region assignments (Border / Saree / …).
 */
function HeroGlb({ url }: { url: string }) {
  const { scene } = useGLTF(url, true);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const controllerRef = useRef<SareeMaterialController | null>(null);
  const assignRef = useRef<RegionAssignSession | null>(null);
  const paintingRef = useRef(false);
  const mapOnRef = useRef(false);
  const rebuildRafRef = useRef(0);
  const baseMasksRef = useRef<Parameters<typeof RegionAssignSession.create>[0] | null>(
    null,
  );

  const color = useCustomizerStore((s) => s.color);
  const shade = useCustomizerStore((s) => s.shade);
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
    controller.inspectModel();

    void session.hydratePersisted().then((ok) => {
      if (ok) {
        controller.setStrictAssignMasks(true);
        controller.refreshAfterMaskEdit();
        invalidate();
      }
    });

    renderConfigurationOnModel(controller);
    invalidate();

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
    controller.setAssignPreview(false);
    renderConfigurationOnModel(controller);
    invalidate();
  }, [color, shade, border, borderColor, pallu, blouse, zari, invalidate]);

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
      session?.persist();
      // Leave the blue/gold guide and draw the real edit on the main saree.
      controller?.setAssignPreview(false);
      controller?.setStrictAssignMasks(!!session?.hasUserEdits(), false);
      if (controller) renderConfigurationOnModel(controller);
      invalidate();
      return;
    }

    // Round brush cursor (not the default + crosshair).
    gl.domElement.style.cursor =
      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'9\' fill=\'none\' stroke=\'%23183A72\' stroke-width=\'2\'/%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'1.5\' fill=\'%23183A72\'/%3E%3C/svg%3E") 12 12, cell';
    mapOnRef.current = false;
    const entering = controllerRef.current;
    entering?.setAssignPreview(false);
    entering?.setStrictAssignMasks(
      !!assignRef.current?.hasUserEdits() || !!assignRef.current?.hasSavedCheckpoint(),
      false,
    );
    if (entering) renderConfigurationOnModel(entering);

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
        controller?.setAssignPreview(false);
        if (controller) renderConfigurationOnModel(controller);
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
      controller?.setAssignPreview(false);
      controller?.setStrictAssignMasks(true, false);
      if (controller) renderConfigurationOnModel(controller);
      session?.persist();
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

useGLTF.preload(HERO_MODEL_PATH, true);

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
