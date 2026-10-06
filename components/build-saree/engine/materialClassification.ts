/**
 * Semantic mesh/material classification for KSIC hero GLB.
 * Prefer exact hero mesh names; never mesh index alone.
 */
import * as THREE from 'three';

export type CustomizationCategory =
  | 'skin'
  | 'face'
  | 'hands'
  | 'hair'
  | 'accessories'
  | 'blouse'
  | 'saree'
  | 'border'
  | 'pallu'
  | 'palluBorder'
  | 'zari';

export type CustomizationTargets = Record<CustomizationCategory, THREE.Mesh[]>;

export const EMPTY_TARGETS: CustomizationTargets = {
  skin: [],
  face: [],
  hands: [],
  hair: [],
  accessories: [],
  blouse: [],
  saree: [],
  border: [],
  pallu: [],
  palluBorder: [],
  zari: [],
};

/** Configurable name tokens (mesh, material, parent). */
export const MATERIAL_MAPPING: Record<CustomizationCategory, string[]> = {
  skin: ['skin', 'character_body', 'skinmaterial', 'material_07_skin'],
  face: ['face', 'head'],
  hands: ['hand', 'hands', 'arm', 'arms'],
  hair: ['hair', 'hairmaterial', 'material_08_hair'],
  accessories: ['jewel', 'jewellery', 'earring', 'bangle', 'accessory'],
  blouse: ['blouse', 'blousematerial', 'material_06_blouse'],
  saree: [
    'saree_main',
    'sareemain',
    'sareemainmaterial',
    'saree_base',
    'sareebase',
    'sareebasematerial',
    'saree_fabric',
    'material_01_body',
  ],
  border: [
    'saree_border',
    'sareeborder',
    'sareebordermaterial',
    'border',
    'hem_border',
    'material_02_border',
  ],
  pallu: ['pallu', 'pallumaterial', 'saree_pallu', 'material_03_pallu'],
  palluBorder: [
    'pallu_border',
    'palluborder',
    'pallubordermaterial',
    'material_04_pallu_border',
  ],
  zari: ['zari', 'zarimaterial', 'gold', 'golden', 'material_05_zari'],
};

/** Exact hero mesh → category (highest priority). */
export const HERO_MESH_CATEGORY: Record<string, CustomizationCategory> = {
  character_body: 'skin',
  hair: 'hair',
  blouse: 'blouse',
  saree_main: 'saree',
  saree_base: 'saree',
  sareecloth: 'saree',
  saree_border: 'border',
  pallu: 'pallu',
  pallu_border: 'palluBorder',
  zari: 'zari',
};

function norm(s: string | undefined): string {
  return (s ?? '').toLowerCase().replace(/[\s.-]+/g, '_');
}

function matchesAny(token: string, patterns: string[]): boolean {
  return patterns.some((p) => {
    if (token === p) return true;
    if (token.startsWith(`${p}_`) || token.endsWith(`_${p}`)) return true;
    if (token.includes(`_${p}_`)) return true;
    return false;
  });
}

export function classifyMesh(mesh: THREE.Mesh): CustomizationCategory[] {
  const meshName = norm(mesh.name);
  const heroCat = HERO_MESH_CATEGORY[meshName];
  if (heroCat) return [heroCat];

  const hits = new Set<CustomizationCategory>();
  const parentName = norm(mesh.parent?.name);

  for (const [cat, patterns] of Object.entries(MATERIAL_MAPPING) as [
    CustomizationCategory,
    string[],
  ][]) {
    if (matchesAny(meshName, patterns) || matchesAny(parentName, patterns)) {
      hits.add(cat);
    }
  }

  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const m of mats) {
    if (!m) continue;
    const matName = norm(m.name);
    for (const [cat, patterns] of Object.entries(MATERIAL_MAPPING) as [
      CustomizationCategory,
      string[],
    ][]) {
      if (matchesAny(matName, patterns)) hits.add(cat);
    }
  }

  if (hits.size === 0) hits.add('accessories');
  return [...hits];
}

export function tagMeshCategory(mesh: THREE.Mesh): CustomizationCategory {
  const cat = classifyMesh(mesh)[0] ?? 'accessories';
  mesh.userData.ksicCategory = cat;
  return cat;
}

export function buildCustomizationTargets(root: THREE.Object3D): CustomizationTargets {
  const targets: CustomizationTargets = {
    skin: [],
    face: [],
    hands: [],
    hair: [],
    accessories: [],
    blouse: [],
    saree: [],
    border: [],
    pallu: [],
    palluBorder: [],
    zari: [],
  };

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const cats = classifyMesh(obj);
    for (const cat of cats) {
      if (!targets[cat].includes(obj)) targets[cat].push(obj);
    }
  });

  return targets;
}

export interface RegionSlot {
  meshes: THREE.Mesh[];
  materials: THREE.Material[];
  materialSlots: Array<{ mesh: string; index: number; material: string }>;
}

export type SareeRegions = {
  skin: RegionSlot;
  blouse: RegionSlot;
  mainSaree: RegionSlot;
  border: RegionSlot;
  pallu: RegionSlot;
  palluBorder: RegionSlot;
  zari: RegionSlot;
  hair: RegionSlot;
  accessories: RegionSlot;
};

function emptySlot(): RegionSlot {
  return { meshes: [], materials: [], materialSlots: [] };
}

export function buildSareeRegions(root: THREE.Object3D): SareeRegions {
  const targets = buildCustomizationTargets(root);
  const mapCat: Record<keyof SareeRegions, CustomizationCategory> = {
    skin: 'skin',
    blouse: 'blouse',
    mainSaree: 'saree',
    border: 'border',
    pallu: 'pallu',
    palluBorder: 'palluBorder',
    zari: 'zari',
    hair: 'hair',
    accessories: 'accessories',
  };

  const regions: SareeRegions = {
    skin: emptySlot(),
    blouse: emptySlot(),
    mainSaree: emptySlot(),
    border: emptySlot(),
    pallu: emptySlot(),
    palluBorder: emptySlot(),
    zari: emptySlot(),
    hair: emptySlot(),
    accessories: emptySlot(),
  };

  for (const [regionKey, cat] of Object.entries(mapCat) as [
    keyof SareeRegions,
    CustomizationCategory,
  ][]) {
    const meshes = targets[cat];
    const materials: THREE.Material[] = [];
    const materialSlots: RegionSlot['materialSlots'] = [];
    for (const mesh of meshes) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m, index) => {
        if (!m) return;
        materials.push(m);
        materialSlots.push({
          mesh: mesh.name,
          index,
          material: m.name || '(unnamed)',
        });
      });
    }
    regions[regionKey] = { meshes, materials, materialSlots };
  }

  return regions;
}

export const REGION_DEBUG_COLORS: Record<CustomizationCategory, string> = {
  skin: '#50C878',
  face: '#70E090',
  hands: '#90F0A0',
  hair: '#222222',
  accessories: '#C0C0C0',
  blouse: '#C850A0',
  saree: '#285ACC',
  border: '#E6BE28',
  pallu: '#14B4B4',
  palluBorder: '#FF8C00',
  zari: '#FFF5B4',
};

export function debugMeshRecord(mesh: THREE.Mesh) {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const geom = mesh.geometry;
  return {
    name: mesh.name,
    parent: mesh.parent?.name ?? null,
    categories: classifyMesh(mesh),
    geometry: {
      vertices: geom.attributes.position?.count ?? 0,
      indices: geom.index?.count ?? 0,
      uv: !!geom.attributes.uv,
      color: !!geom.attributes.color,
      groups: geom.groups?.map((g) => ({
        start: g.start,
        count: g.count,
        materialIndex: g.materialIndex,
      })),
    },
    material: mats.filter(Boolean).map((m) => ({
      name: m!.name,
      type: m!.type,
      color: 'color' in m! ? (m as THREE.MeshStandardMaterial).color?.getHexString() : null,
      map: !!(m as THREE.MeshStandardMaterial).map,
      normalMap: !!(m as THREE.MeshStandardMaterial).normalMap,
      roughnessMap: !!(m as THREE.MeshStandardMaterial).roughnessMap,
      metalnessMap: !!(m as THREE.MeshStandardMaterial).metalnessMap,
      aoMap: !!(m as THREE.MeshStandardMaterial).aoMap,
    })),
  };
}

export function debugModelTree(root: THREE.Object3D) {
  const rows: ReturnType<typeof debugMeshRecord>[] = [];
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) rows.push(debugMeshRecord(obj));
  });
  return rows;
}
