import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCustomizerStore } from '../../store/customizerStore';
import { resolveMaterials } from '../../engine/materialEngine';
import { MATERIAL_SLOTS, borderTextureOf } from '../../data/catalog';
import { createBorderPattern, createPalluPattern } from '../../engine/textures';

/**
 * Fixed-drape stand-in with the SAME named material slots as the professional GLB.
 * Drop `public/models/saree-hero.glb` with these slot names to replace this mesh.
 */
export function FixedDrapeStandIn() {
  const config = useCustomizerStore();
  const mats = useMemo(() => resolveMaterials(config), [config]);
  const group = useRef<THREE.Group>(null);

  const sareeMat = useRef(
    new THREE.MeshPhysicalMaterial({
      color: mats.sareeHex,
      roughness: mats.sareeRoughness,
      metalness: mats.sareeMetalness,
      sheen: mats.sareeSheen,
      sheenColor: new THREE.Color('#fff4e0'),
      clearcoat: 0.15,
      side: THREE.DoubleSide,
    }),
  );
  const borderMat = useRef(
    new THREE.MeshPhysicalMaterial({
      color: mats.borderHex,
      metalness: mats.borderMetalness,
      roughness: mats.borderRoughness,
      side: THREE.DoubleSide,
    }),
  );
  const palluMat = useRef(
    new THREE.MeshPhysicalMaterial({
      color: mats.palluHex,
      roughness: mats.sareeRoughness,
      metalness: mats.sareeMetalness,
      sheen: mats.sareeSheen,
      sheenColor: new THREE.Color('#fff4e0'),
      side: THREE.DoubleSide,
    }),
  );
  const blouseMat = useRef(
    new THREE.MeshPhysicalMaterial({
      color: mats.blouseHex,
      roughness: 0.35,
      metalness: 0.05,
      sheen: 0.5,
      sheenColor: new THREE.Color(mats.blouseHex),
    }),
  );
  const zariMat = useRef(
    new THREE.MeshPhysicalMaterial({
      color: mats.zariHex,
      metalness: mats.zariMetalness,
      roughness: mats.zariRoughness,
      emissive: new THREE.Color(mats.zariHex),
      emissiveIntensity: 0.12,
    }),
  );

  // Smooth material updates — ONLY saree / pallu follow sareeBaseColor.
  // Border, zari, blouse stay locked (blouse fixed; border/zari from their own slots).
  useEffect(() => {
    const lerpColor = (mat: THREE.MeshPhysicalMaterial, hex: string) => {
      mat.color.lerp(new THREE.Color(hex), 1);
    };

    if (sareeMat.current.map) {
      sareeMat.current.map.dispose();
      sareeMat.current.map = null;
    }
    lerpColor(sareeMat.current, mats.sareeHex);
    sareeMat.current.roughness = mats.sareeRoughness;
    sareeMat.current.metalness = mats.sareeMetalness;
    sareeMat.current.sheen = mats.sareeSheen;
    sareeMat.current.needsUpdate = true;

    // Border LOCKED to border colour slot — never sareeBaseColor
    lerpColor(borderMat.current, mats.borderHex);
    borderMat.current.metalness = mats.borderMetalness;
    borderMat.current.roughness = mats.borderRoughness;

    // Pallu fabric follows saree base (SAREE_BASE); decorative maps stay separate
    lerpColor(palluMat.current, mats.palluHex);
    palluMat.current.roughness = mats.sareeRoughness;
    palluMat.current.sheen = mats.sareeSheen;

    // Blouse LOCKED — fixed tone, independent of saree colour
    const lockedBlouse = '#6B2A38';
    lerpColor(blouseMat.current, lockedBlouse);
    blouseMat.current.sheenColor.set(lockedBlouse);

    lerpColor(zariMat.current, mats.zariHex);
    zariMat.current.metalness = mats.zariMetalness;
    zariMat.current.roughness = mats.zariRoughness;
    zariMat.current.emissive.set(mats.zariHex);
    zariMat.current.emissiveIntensity = 0.08 + mats.zariIntensity * 0.12;
  }, [mats]);

  // Texture maps for border / pallu patterns
  useEffect(() => {
    const borderUrl = createBorderPattern(
      borderTextureOf(config.border),
      mats.borderHex,
      mats.zariHex,
    );
    const palluUrl = createPalluPattern(
      mats.palluPattern,
      mats.palluHex,
      mats.zariHex,
    );

    const loader = new THREE.TextureLoader();
    loader.load(borderUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      borderMat.current.map = tex;
      borderMat.current.needsUpdate = true;
    });
    loader.load(palluUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      palluMat.current.map = tex;
      palluMat.current.needsUpdate = true;
    });
  }, [config.border, mats.borderHex, mats.zariHex, mats.palluPattern, mats.palluHex]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.04;
  });

  const skirtGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.12, 0.95),
      new THREE.Vector2(0.19, 0.9),
      new THREE.Vector2(0.21, 0.7),
      new THREE.Vector2(0.24, 0.45),
      new THREE.Vector2(0.29, 0.18),
      new THREE.Vector2(0.33, -0.05),
      new THREE.Vector2(0.34, -0.12),
    ];
    const geo = new THREE.LatheGeometry(pts, 64);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const ang = Math.atan2(z, x);
      const wave = Math.sin(ang * 6 + y * 4) * 0.012 * Math.max(0, 0.8 - y);
      const r = Math.hypot(x, z) + wave;
      pos.setXYZ(i, Math.cos(ang) * r, y, Math.sin(ang) * r);
    }
    geo.computeVertexNormals();
    geo.name = MATERIAL_SLOTS.SAREE_BODY;
    return geo;
  }, []);

  const bodyGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.0, 1.72),
      new THREE.Vector2(0.1, 1.68),
      new THREE.Vector2(0.11, 1.58),
      new THREE.Vector2(0.045, 1.45),
      new THREE.Vector2(0.16, 1.34),
      new THREE.Vector2(0.14, 1.18),
      new THREE.Vector2(0.11, 1.02),
      new THREE.Vector2(0.14, 0.9),
      new THREE.Vector2(0.12, 0.5),
      new THREE.Vector2(0.06, 0.05),
      new THREE.Vector2(0.0, -0.05),
    ];
    return new THREE.LatheGeometry(pts, 40);
  }, []);

  const palluCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.12, 0.98, 0.12),
        new THREE.Vector3(0.05, 1.18, 0.14),
        new THREE.Vector3(0.16, 1.34, 0.02),
        new THREE.Vector3(0.22, 1.15, -0.12),
        new THREE.Vector3(0.26, 0.75, -0.1),
        new THREE.Vector3(0.22, 0.3, 0.0),
        new THREE.Vector3(0.14, -0.02, 0.05),
      ]),
    [],
  );

  return (
    <group ref={group} position={[0, -0.82, 0]} scale={1.1}>
      {/* Skin */}
      <mesh name={MATERIAL_SLOTS.SKIN} geometry={bodyGeo} castShadow>
        <meshStandardMaterial color="#E8C9B0" roughness={0.58} />
      </mesh>
      <mesh name={MATERIAL_SLOTS.HAIR} position={[0, 1.68, -0.02]} castShadow>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#241910" roughness={0.78} />
      </mesh>
      <mesh position={[-0.24, 1.08, 0]} rotation={[0.1, 0, 0.28]} castShadow>
        <capsuleGeometry args={[0.036, 0.48, 6, 12]} />
        <meshStandardMaterial color="#E8C9B0" roughness={0.58} />
      </mesh>
      <mesh position={[0.24, 1.08, 0]} rotation={[0.1, 0, -0.28]} castShadow>
        <capsuleGeometry args={[0.036, 0.48, 6, 12]} />
        <meshStandardMaterial color="#E8C9B0" roughness={0.58} />
      </mesh>

      {/* Blouse */}
      <mesh name={MATERIAL_SLOTS.BLOUSE} position={[0, 1.2, 0]} castShadow material={blouseMat.current}>
        <sphereGeometry args={[0.15, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
      </mesh>

      {/* Saree body */}
      <mesh name={MATERIAL_SLOTS.SAREE_BODY} geometry={skirtGeo} castShadow receiveShadow material={sareeMat.current} />

      {/* Pleats */}
      {Array.from({ length: 9 }).map((_, i) => {
        const t = (i - 4) / 4;
        return (
          <mesh
            key={i}
            position={[t * 0.08, 0.42, 0.2]}
            rotation={[0.1, t * 0.22, 0]}
            castShadow
            material={sareeMat.current}
          >
            <boxGeometry args={[0.02, 0.75 + (1 - Math.abs(t)) * 0.15, 0.08]} />
          </mesh>
        );
      })}

      {/* Pallu */}
      <mesh name={MATERIAL_SLOTS.PALLU} castShadow material={palluMat.current}>
        <tubeGeometry args={[palluCurve, 48, 0.055, 12, false]} />
      </mesh>
      <mesh castShadow material={palluMat.current}>
        <tubeGeometry args={[palluCurve, 48, 0.1, 8, false]} />
      </mesh>

      {/* Border */}
      <mesh name={MATERIAL_SLOTS.BORDER} position={[0, -0.1, 0]} castShadow material={borderMat.current}>
        <cylinderGeometry args={[0.34, 0.345, 0.06, 64, 1, true]} />
      </mesh>

      {/* Zari */}
      <mesh name={MATERIAL_SLOTS.ZARI} position={[0, -0.04, 0]} castShadow material={zariMat.current}>
        <cylinderGeometry args={[0.33, 0.335, 0.025, 64, 1, true]} />
      </mesh>
      <mesh material={zariMat.current}>
        <tubeGeometry args={[palluCurve, 40, 0.012, 8, false]} />
      </mesh>
    </group>
  );
}
