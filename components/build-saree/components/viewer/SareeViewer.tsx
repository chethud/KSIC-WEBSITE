import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { AdaptiveDpr } from '@react-three/drei';
import { HeroModel3D } from './HeroModel3D';
import { StudioLighting } from './StudioLighting';
import { CameraRig } from './CameraRig';
import { InteractivePreview } from './InteractivePreview';
import { useCustomizerStore } from '../../store/customizerStore';
import { HERO_MODEL_PATH } from '../../data/catalog';

function FpsGuard() {
  return null;
}

export function SareeViewer() {
  const renderMode = useCustomizerStore((s) => s.renderMode);
  const modelEditMode = useCustomizerStore((s) => s.modelEditMode);

  if (renderMode === 'preview') {
    return <InteractivePreview />;
  }

  return (
    <div className={`viewer-root${modelEditMode ? ' is-assigning' : ''}`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.85, 2.85], fov: 35, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#ffffff', 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <HeroModel3D hasHeroModel modelUrl={HERO_MODEL_PATH} />
          <CameraRig />
          <FpsGuard />
          <AdaptiveDpr />
          <mesh
            name="studio-floor"
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.001, 0]}
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
