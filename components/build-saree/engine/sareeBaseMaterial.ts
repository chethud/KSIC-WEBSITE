/**
 * SAREE_BASE material isolation helpers.
 *
 * Hero GLB packs skin/hair/silk/gold in one atlas on mesh `SareeCloth`.
 * Recolour is done ONLY by swapping a pre-baked silk albedo on that mesh.
 * Never tint the whole scene. Never mutate shared materials — always clone.
 *
 * Locked (never modified by colour): BODY, FACE, HAIR, JEWELLERY, BLOUSE,
 * BORDER, ZARI, ENVIRONMENT — those are identical pixels across colour PNGs.
 */
import * as THREE from 'three';

/** Mesh names that own the saree fabric atlas */
export const SAREE_BASE_MESH_NAMES = new Set(['SareeCloth', 'Saree_Base']);

/** Material names on the hero GLB that map to SAREE_BASE */
export const SAREE_BASE_MATERIAL_NAMES = new Set([
  'MATERIAL_01_BODY',
  'MATERIAL_01_BODY.001',
  'SAREE_BASE',
  'SareeBaseMaterial',
]);

export function isSareeBaseMesh(mesh: THREE.Mesh): boolean {
  if (SAREE_BASE_MESH_NAMES.has(mesh.name)) return true;
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.some((m) => m && SAREE_BASE_MATERIAL_NAMES.has(m.name));
}

export function logSceneHierarchy(root: THREE.Object3D): void {
  const lines: string[] = ['[SAREE_BASE] scene hierarchy'];
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      const matInfo = mats
        .filter(Boolean)
        .map((m) => `${m!.name || '(unnamed)'} (${m!.type})`)
        .join(', ');
      const tag = isSareeBaseMesh(obj) ? ' ← SAREE_BASE (editable)' : ' ← LOCKED';
      lines.push(`  mesh "${obj.name}" materials=[${matInfo}]${tag}`);
    } else if (obj.name) {
      lines.push(`  node "${obj.name}" (${obj.type})`);
    }
  });
  // eslint-disable-next-line no-console
  console.info(lines.join('\n'));
}
