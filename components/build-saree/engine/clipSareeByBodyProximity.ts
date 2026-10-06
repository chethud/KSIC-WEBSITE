/**
 * Remove clothing triangles that duplicate Character_Body surfaces in 3D.
 * Clothing meshes may still carry face/hand shell tris after UV split.
 */
import * as THREE from 'three';

const CLOTHING_MESHES = new Set([
  'Saree_Main',
  'Saree_Base',
  'Saree_Border',
  'Pallu',
  'Pallu_Border',
  'Blouse',
  'Zari',
]);

function collectTriangleCentroidsWorld(mesh: THREE.Mesh): THREE.Vector3[] {
  const geom = mesh.geometry;
  const pos = geom.attributes.position as THREE.BufferAttribute;
  const index = geom.index;
  mesh.updateMatrixWorld(true);
  const m = mesh.matrixWorld;
  const out: THREE.Vector3[] = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();

  const pushTri = (ia: number, ib: number, ic: number) => {
    a.fromBufferAttribute(pos, ia).applyMatrix4(m);
    b.fromBufferAttribute(pos, ib).applyMatrix4(m);
    c.fromBufferAttribute(pos, ic).applyMatrix4(m);
    out.push(new THREE.Vector3().addVectors(a, b).add(c).multiplyScalar(1 / 3));
  };

  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      pushTri(index.getX(i), index.getX(i + 1), index.getX(i + 2));
    }
  } else {
    for (let i = 0; i < pos.count; i += 3) pushTri(i, i + 1, i + 2);
  }
  return out;
}

function filterClothingByBodyDistance(
  mesh: THREE.Mesh,
  bodyCentroids: THREE.Vector3[],
  maxDistance: number,
): number {
  const geom = mesh.geometry;
  const pos = geom.attributes.position as THREE.BufferAttribute;
  const index = geom.index;
  mesh.updateMatrixWorld(true);
  const m = mesh.matrixWorld;
  const kept: number[] = [];
  let removed = 0;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const centroid = new THREE.Vector3();

  const consider = (ia: number, ib: number, ic: number) => {
    a.fromBufferAttribute(pos, ia).applyMatrix4(m);
    b.fromBufferAttribute(pos, ib).applyMatrix4(m);
    c.fromBufferAttribute(pos, ic).applyMatrix4(m);
    centroid.copy(a).add(b).add(c).multiplyScalar(1 / 3);

    let minD = Number.POSITIVE_INFINITY;
    for (let i = 0; i < bodyCentroids.length; i++) {
      const d = centroid.distanceTo(bodyCentroids[i]);
      if (d < minD) minD = d;
    }

    const y = centroid.y;
    const absX = Math.abs(centroid.x);
    // Head shell on clothing meshes must never tint the face.
    if (y > 1.38) {
      removed += 1;
      return;
    }
    const inHeadBand = y > 1.28;
    const inHandBand = y > 0.82 && absX > 0.16;
    const limit = inHeadBand ? maxDistance * 2.5 : maxDistance;
    if (minD < limit && (inHeadBand || inHandBand)) {
      removed += 1;
      return;
    }
    kept.push(ia, ib, ic);
  };

  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      consider(index.getX(i), index.getX(i + 1), index.getX(i + 2));
    }
  } else {
    for (let i = 0; i < pos.count; i += 3) consider(i, i + 1, i + 2);
  }

  if (kept.length > 0) {
    geom.setIndex(kept);
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
    geom.computeBoundingBox();
  }
  return removed;
}

export function clipClothingAwayFromBodySurface(
  root: THREE.Object3D,
  maxDistance = 0.01,
): number {
  let body: THREE.Mesh | null = null;
  const clothing: THREE.Mesh[] = [];
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    if (obj.name === 'Character_Body') body = obj;
    if (CLOTHING_MESHES.has(obj.name)) clothing.push(obj);
  });
  if (!body || clothing.length === 0) return 0;

  const bodyCentroids = collectTriangleCentroidsWorld(body);
  let total = 0;
  for (const mesh of clothing) {
    const n = filterClothingByBodyDistance(mesh, bodyCentroids, maxDistance);
    total += n;
    if (n > 0) {
      // eslint-disable-next-line no-console
      console.info(`[CLOTHING_PROX] ${mesh.name}: removed ${n} body-overlap tris`);
    }
  }
  return total;
}

/** @deprecated */
export function clipSareeAwayFromBodySurface(
  root: THREE.Object3D,
  maxDistance = 0.01,
): number {
  return clipClothingAwayFromBodySurface(root, maxDistance);
}
