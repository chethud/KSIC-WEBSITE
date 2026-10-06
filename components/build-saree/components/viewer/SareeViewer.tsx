import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { AdaptiveDpr } from '@react-three/drei';
import { HeroModel3D } from './HeroModel3D';
import { StudioLighting } from './StudioLighting';
import { CameraRig } from './CameraRig';
import { InteractivePreview } from './InteractivePreview';
import { useCustomizerStore } from '../../store/customizerStore';
import { HERO_MODEL_PATH, MASTER_SAREE_OPTIMIZED_PATH } from '../../data/catalog';

function FpsGuard() {
  return null;
}

export function SareeViewer() {
  const renderMode = useCustomizerStore((s) => s.renderMode);
  const modelEditMode = useCustomizerStore((s) => s.modelEditMode);
  const [modelUrl, setModelUrl] = useState(HERO_MODEL_PATH);
  const [hasHeroModel, setHasHeroModel] = useState(false);

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const preferred = isMobile ? MASTER_SAREE_OPTIMIZED_PATH : HERO_MODEL_PATH;
    fetch(preferred, { method: 'HEAD' })
      .then((r) => {
        if (r.ok) {
          setModelUrl(preferred);
          setHasHeroModel(true);
          return;
        }
        return fetch(HERO_MODEL_PATH, { method: 'HEAD' });
      })
      .then((r) => {
        if (r && r.ok) {
          setModelUrl(HERO_MODEL_PATH);
          setHasHeroModel(true);
        }
      })
      .catch(() => setHasHeroModel(false));
  }, []);

  if (renderMode === 'preview') {
    return <InteractivePreview />;
  }

  return (
    <div className={`viewer-root${modelEditMode ? ' is-assigning' : ''}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.88, 2.55], fov: 35, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: true,
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#ffffff', 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <HeroModel3D hasHeroModel={hasHeroModel} modelUrl={modelUrl} />
          <CameraRig />
          <FpsGuard />
          <AdaptiveDpr />
          <mesh
            name="studio-floor"
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.001, 0]}
            receiveShadow
            raycast={modelEditMode ? () => {} : undefined}
          >
            <circleGeometry args={[3.2, 64]} />
            <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
