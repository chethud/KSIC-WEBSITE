import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCustomizerStore } from '../../store/customizerStore';
import type { CameraView } from '../../types/customization';

const PRESETS: Record<
  CameraView | 'reset',
  { position: [number, number, number]; target: [number, number, number] }
> = {
  // Original full-figure framing — head-to-toe namaste in the white studio.
  'three-quarter': { position: [1.2, 0.9, 2.45], target: [0, 0.85, 0] },
  front: { position: [0, 0.85, 2.85], target: [0, 0.75, 0] },
  side: { position: [2.55, 0.88, 0.15], target: [0, 0.85, 0] },
  back: { position: [0.12, 0.9, -2.55], target: [0, 0.85, 0] },
  detail: { position: [0.85, 0.95, 1.45], target: [0.05, 0.95, 0] },
  reset: { position: [0, 0.85, 2.85], target: [0, 0.75, 0] },
};

export function CameraRig() {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const cameraView = useCustomizerStore((s) => s.cameraView);
  const modelEditMode = useCustomizerStore((s) => s.modelEditMode);
  const { camera } = useThree();
  const animating = useRef(false);
  const fromPos = useRef(new THREE.Vector3());
  const toPos = useRef(new THREE.Vector3());
  const fromTarget = useRef(new THREE.Vector3());
  const toTarget = useRef(new THREE.Vector3());
  const progress = useRef(1);

  const goToPreset = (view: CameraView | 'reset') => {
    const p = PRESETS[view] ?? PRESETS.front;
    if (!controls.current) return;
    fromPos.current.copy(camera.position);
    toPos.current.set(...p.position);
    fromTarget.current.copy(controls.current.target);
    toTarget.current.set(...p.target);
    progress.current = 0;
    animating.current = true;
  };

  useEffect(() => {
    goToPreset(cameraView);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate only when view changes
  }, [cameraView, camera]);

  // Entering Edit model always restores the original full-body front pose.
  useEffect(() => {
    if (!modelEditMode) return;
    goToPreset('front');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelEditMode]);

  // Close zoom was clipping the mesh (grey cutaway) and blocking paint rays.
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    camera.near = modelEditMode ? 0.05 : 0.1;
    camera.far = modelEditMode ? 60 : 40;
    camera.updateProjectionMatrix();
  }, [modelEditMode, camera]);

  useFrame((_, delta) => {
    if (!controls.current || !animating.current) return;
    progress.current = Math.min(1, progress.current + delta * 1.35);
    const t = 1 - Math.pow(1 - progress.current, 3);
    camera.position.lerpVectors(fromPos.current, toPos.current, t);
    controls.current.target.lerpVectors(fromTarget.current, toTarget.current, t);
    controls.current.update();
    if (progress.current >= 1) animating.current = false;
  });

  // Edit mode: left / 1-finger = paint; right-drag = rotate; wheel / 2-finger = zoom+orbit.
  // Use -1 so OrbitControls ignores that gesture (undefined props get dropped by React).
  const editMouse = modelEditMode
    ? { LEFT: -1 as unknown as THREE.MOUSE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }
    : { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  const editTouches = modelEditMode
    ? { ONE: -1 as unknown as THREE.TOUCH, TWO: THREE.TOUCH.DOLLY_ROTATE }
    : { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

  return (
    <OrbitControls
      ref={controls}
      enablePan={modelEditMode}
      enableRotate
      enableZoom
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.5}
      zoomSpeed={modelEditMode ? 1.35 : 0.9}
      zoomToCursor={modelEditMode}
      minDistance={modelEditMode ? 0.12 : 1.4}
      maxDistance={modelEditMode ? 14 : 4}
      minPolarAngle={modelEditMode ? 0.2 : Math.PI * 0.3}
      maxPolarAngle={modelEditMode ? Math.PI * 0.78 : Math.PI * 0.7}
      target={[0, 0.85, 0]}
      mouseButtons={editMouse}
      touches={editTouches}
      makeDefault
    />
  );
}
