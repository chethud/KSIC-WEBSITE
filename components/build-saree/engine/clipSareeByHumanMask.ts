/**
 * UV-aligned geometry cleanup after Blender split.
 * - Character_Body: keep only human-lock UV triangles
 * - Saree_Base: keep only plain-paint UV triangles (never face/hands)
 */
import * as THREE from 'three';

function readMaskPixels(image: TexImageSource): {
  data: Uint8ClampedArray;
  width: number;
  height: number;
} {
  const canvas = document.createElement('canvas');
  const bitmap = image as CanvasImageSource & { width: number; height: number };
  const width = bitmap.width;
  const height = bitmap.height;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);
  const img = ctx.getImageData(0, 0, width, height);
  return { data: img.data, width, height };
}

function sampleMask(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  u: number,
  v: number,
  flipY: boolean,
): number {
  const x = Math.min(width - 1, Math.max(0, Math.floor((u % 1) * width)));
  const vv = flipY ? 1 - (v % 1) : v % 1;
  const y = Math.min(height - 1, Math.max(0, Math.floor(vv * height)));
  const i = (y * width + x) * 4;
  return data[i] / 255;
}

function triCentroidUV(
  uvs: THREE.BufferAttribute,
  ia: number,
  ib: number,
  ic: number,
): { u: number; v: number } {
  return {
    u: (uvs.getX(ia) + uvs.getX(ib) + uvs.getX(ic)) / 3,
    v: (uvs.getY(ia) + uvs.getY(ib) + uvs.getY(ic)) / 3,
  };
}

function triVertexUVs(
  uvs: THREE.BufferAttribute,
  ia: number,
  ib: number,
  ic: number,
): { u: number; v: number }[] {
  return [
    { u: uvs.getX(ia), v: uvs.getY(ia) },
    { u: uvs.getX(ib), v: uvs.getY(ib) },
    { u: uvs.getX(ic), v: uvs.getY(ic) },
  ];
}

type FlipYStrategy = 'minRemoved' | 'maxRemoved';

function filterTriangles(
  geom: THREE.BufferGeometry,
  predicate: (u: number, v: number, flipY: boolean) => boolean,
  flipStrategy: FlipYStrategy = 'minRemoved',
  forcedFlipY?: boolean,
): { kept: number[]; removed: number; flipY: boolean } {
  const uvs = geom.attributes.uv as THREE.BufferAttribute | undefined;
  if (!uvs) return { kept: [], removed: 0, flipY: false };

  const index = geom.index;
  let best = {
    kept: [] as number[],
    removed: flipStrategy === 'minRemoved' ? Number.POSITIVE_INFINITY : -1,
    flipY: false,
  };

  const flipCandidates =
    forcedFlipY === undefined ? [false, true] : [forcedFlipY];

  for (const flipY of flipCandidates) {
    const kept: number[] = [];
    let removed = 0;
    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        const a = index.getX(i);
        const b = index.getX(i + 1);
        const c = index.getX(i + 2);
        const { u, v } = triCentroidUV(uvs, a, b, c);
        if (!predicate(u, v, flipY)) {
          removed += 1;
          continue;
        }
        kept.push(a, b, c);
      }
    } else {
      for (let i = 0; i < uvs.count; i += 3) {
        const { u, v } = triCentroidUV(uvs, i, i + 1, i + 2);
        if (!predicate(u, v, flipY)) {
          removed += 1;
          continue;
        }
        kept.push(i, i + 1, i + 2);
      }
    }
    const better =
      flipStrategy === 'minRemoved'
        ? removed < best.removed
        : removed > best.removed && kept.length > 0;
    if (better) best = { kept, removed, flipY };
  }

  return best;
}

function applyFilteredIndex(mesh: THREE.Mesh, kept: number[]): void {
  if (kept.length === 0) return;
  mesh.geometry.setIndex(kept);
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeBoundingSphere();
  mesh.geometry.computeBoundingBox();
}

function filterBodyHumanTriangles(
  geom: THREE.BufferGeometry,
  humanMask: TexImageSource,
): { kept: number[]; removed: number; flipY: boolean } {
  const uvs = geom.attributes.uv as THREE.BufferAttribute | undefined;
  if (!uvs) return { kept: [], removed: 0, flipY: false };
  const { data, width, height } = readMaskPixels(humanMask);
  const index = geom.index;

  let best = { kept: [] as number[], removed: Number.POSITIVE_INFINITY, flipY: false };

  for (const flipY of [false, true]) {
    const kept: number[] = [];
    let removed = 0;
    const consider = (a: number, b: number, c: number) => {
      const { u, v } = triCentroidUV(uvs, a, b, c);
      const centroid = sampleMask(data, width, height, u, v, flipY);
      const verts = triVertexUVs(uvs, a, b, c);
      const vertexHit = verts.some(
        ({ u: uu, v: vv }) =>
          sampleMask(data, width, height, uu, vv, flipY) > 0.32,
      );
      if (centroid > 0.45 || vertexHit) {
        kept.push(a, b, c);
      } else {
        removed += 1;
      }
    };
    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        consider(index.getX(i), index.getX(i + 1), index.getX(i + 2));
      }
    } else {
      for (let i = 0; i < uvs.count; i += 3) consider(i, i + 1, i + 2);
    }
    if (removed < best.removed) best = { kept, removed, flipY };
  }
  return best;
}

export function clipCharacterBodyToHumanUV(
  mesh: THREE.Mesh,
  humanMask: TexImageSource,
): number {
  if (mesh.name !== 'Character_Body') return 0;
  const { kept, removed, flipY } = filterBodyHumanTriangles(
    mesh.geometry,
    humanMask,
  );
  applyFilteredIndex(mesh, kept);
  mesh.userData.ksicUvFlipY = flipY;
  // eslint-disable-next-line no-console
  console.info(
    `[BODY_CLIP] Kept ${kept.length / 3} tris, removed ${removed} (flipY=${flipY})`,
  );
  return removed;
}

export function clipSareeMeshToFabricUV(
  mesh: THREE.Mesh,
  paintMask: TexImageSource,
  humanMask: TexImageSource,
  forcedFlipY?: boolean,
): number {
  if (mesh.name !== 'Saree_Base') return 0;
  const paint = readMaskPixels(paintMask);
  const human = readMaskPixels(humanMask);

  const uvs = mesh.geometry.attributes.uv as THREE.BufferAttribute | undefined;

  const { kept, removed, flipY } = filterTriangles(
    mesh.geometry,
    (u, v, flipY) => {
      const h = sampleMask(human.data, human.width, human.height, u, v, flipY);
      if (h > 0.35) return false;
      const p = sampleMask(paint.data, paint.width, paint.height, u, v, flipY);
      return p > 0.45;
    },
    'maxRemoved',
    forcedFlipY,
  );

  /** Stricter pass: drop any tri with a vertex in the human UV region. */
  let strictKept = kept;
  if (uvs && kept.length > 0) {
    strictKept = [];
    let strictRemoved = 0;
    for (let i = 0; i < kept.length; i += 3) {
      const a = kept[i];
      const b = kept[i + 1];
      const c = kept[i + 2];
      const verts = triVertexUVs(uvs, a, b, c);
      const humanHit = verts.some(
        ({ u, v }) =>
          sampleMask(human.data, human.width, human.height, u, v, flipY) > 0.28,
      );
      if (humanHit) {
        strictRemoved += 1;
        continue;
      }
      strictKept.push(a, b, c);
    }
    // eslint-disable-next-line no-console
    console.info(
      `[SAREE_CLIP_STRICT] Removed ${strictRemoved} extra human-adjacent tris`,
    );
  }

  applyFilteredIndex(mesh, strictKept);
  mesh.userData.ksicUvFlipY = flipY;
  // eslint-disable-next-line no-console
  console.info(
    `[SAREE_CLIP] Kept ${strictKept.length / 3} tris, removed ${removed} (flipY=${flipY})`,
  );
  return removed;
}

export function clipHeroMeshesByUV(
  root: THREE.Object3D,
  humanMask: TexImageSource,
  paintMask: TexImageSource,
): void {
  let bodyFlipY = false;
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    if (obj.name === 'Character_Body') {
      clipCharacterBodyToHumanUV(obj, humanMask);
      bodyFlipY = obj.userData.ksicUvFlipY === true;
    }
  });
  /** Atlas masks align with opposite V flip on the cloth mesh vs body mesh. */
  const sareeFlipY = !bodyFlipY;
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.name === 'Saree_Base') {
      clipSareeMeshToFabricUV(obj, paintMask, humanMask, sareeFlipY);
    }
  });
}

/** @deprecated use clipHeroMeshesByUV */
export function clipHeroSareeByHumanMask(
  root: THREE.Object3D,
  maskImage: TexImageSource,
): number {
  let n = 0;
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.name === 'Saree_Base') {
      n += clipSareeMeshToFabricUV(obj, maskImage, maskImage);
    }
  });
  return n;
}
