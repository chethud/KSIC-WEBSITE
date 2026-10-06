"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Rotate3d, Maximize2, Minimize2, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import type { Product } from './types';

const T = THREE as any;

interface Product3DViewerProps {
  product: Product;
  className?: string;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({ product, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Three.js instances
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const drapeGroupRef = useRef<any>(null);
  const keyLightRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Camera settings
  const DEFAULT_CAM_POS = new T.Vector3(0, 0.08, 2.92);
  const DEFAULT_TARGET = new T.Vector3(0, -0.05, 0);

  // Intro gentle rotation sweep
  const introRotationTargetRef = useRef<number>(0.10); // ~6 degrees
  const introRotationCurrentRef = useRef<number>(-0.10);
  const isIntroAnimatingRef = useRef<boolean>(true);

  /**
   * Reset Camera View
   */
  const handleResetView = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    controlsRef.current.reset();
    cameraRef.current.position.copy(DEFAULT_CAM_POS);
    controlsRef.current.target.copy(DEFAULT_TARGET);
    controlsRef.current.update();
    if (drapeGroupRef.current) {
      drapeGroupRef.current.rotation.y = 0;
    }
  }, []);

  /**
   * Zoom In / Zoom Out
   */
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    if (!controlsRef.current || !cameraRef.current) return;
    const factor = direction === 'in' ? 0.82 : 1.22;
    const offset = cameraRef.current.position.clone().sub(controlsRef.current.target);
    offset.multiplyScalar(factor);
    // Clamp distance between 1.6 and 4.2
    const len = offset.length();
    if (len >= 1.6 && len <= 4.2) {
      cameraRef.current.position.copy(controlsRef.current.target).add(offset);
      controlsRef.current.update();
    }
  }, []);

  /**
   * Toggle Fullscreen
   */
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Initialize Scene, Camera, Renderer, Controls
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene
    const scene = new T.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;
    const camera = new T.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.copy(DEFAULT_CAM_POS);
    cameraRef.current = camera;

    // 3. WebGLRenderer with transparency and filmic tone mapping
    let renderer: any;
    try {
      renderer = new T.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      rendererRef.current = renderer;
    } catch {
      setLoadError(true);
      return;
    }

    // 4. Studio Showroom Lighting
    const ambientLight = new T.AmbientLight(0xfffbf2, 1.45);
    scene.add(ambientLight);

    // Warm Key Light (Top-Right)
    const keyLight = new T.DirectionalLight(0xfff0dd, 2.5);
    keyLight.position.set(3.0, 4.0, 3.2);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Subtle Daylight Fill Light (Left)
    const fillLight = new T.DirectionalLight(0xe8f0fb, 1.15);
    fillLight.position.set(-3.2, 2.2, 2.2);
    scene.add(fillLight);

    // Soft Rim Light (Behind drape silhouette)
    const rimLight = new T.DirectionalLight(0xfffaee, 1.8);
    rimLight.position.set(0, 3.2, -3.2);
    scene.add(rimLight);

    // 5. Realistic Circular Ground Contact Shadow on Dais
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(256, 256, 20, 256, 256, 240);
      grad.addColorStop(0, 'rgba(38, 25, 16, 0.65)');
      grad.addColorStop(0.32, 'rgba(38, 25, 16, 0.42)');
      grad.addColorStop(0.68, 'rgba(38, 25, 16, 0.12)');
      grad.addColorStop(1, 'rgba(38, 25, 16, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 512, 512);
    }
    const shadowTexture = new T.CanvasTexture(shadowCanvas);
    const shadowGeo = new T.PlaneGeometry(1.85, 1.45);
    const shadowMat = new T.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    const shadowMesh = new T.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.24;
    scene.add(shadowMesh);

    // 6. OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 1.6;
    controls.maxDistance = 4.2;
    controls.minPolarAngle = Math.PI / 4.2; // Don't look from extreme top
    controls.maxPolarAngle = Math.PI / 1.94; // Don't look under limestone dais
    controls.target.copy(DEFAULT_TARGET);
    controlsRef.current = controls;

    controls.addEventListener('start', () => setIsInteracting(true));
    controls.addEventListener('end', () => setIsInteracting(false));

    // Dynamic light movement tracking mouse pointer
    const handlePointerMove = (e: PointerEvent) => {
      if (!keyLightRef.current || !container) return;
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      keyLightRef.current.position.set(3.0 + nx * 1.5, 4.0 - ny * 1.5, 3.2);
    };
    container.addEventListener('pointermove', handlePointerMove);

    // 7. Animation / Render Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Gentle introductory oscillation on load
      if (isIntroAnimatingRef.current && drapeGroupRef.current) {
        const remaining = introRotationTargetRef.current - introRotationCurrentRef.current;
        if (Math.abs(remaining) > 0.001) {
          const step = remaining * 0.045;
          introRotationCurrentRef.current += step;
          drapeGroupRef.current.rotation.y = introRotationCurrentRef.current;
        } else {
          isIntroAnimatingRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      resizeObserver.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
      shadowTexture.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
    };
  }, []);

  /**
   * Build Parametric Volumetric 3D Drape Geometry
   * Front and Back meshes seamlessly join at the side boundaries (z = 0),
   * providing genuine 3D volume, elliptical thickness, and natural garment curves.
   */
  const createVolumetricDrape = useCallback(() => {
    const widthSegments = 48;
    const heightSegments = 48;

    const frontGeo = new T.PlaneGeometry(1.82, 2.44, widthSegments, heightSegments);
    const frontPos = frontGeo.attributes.position;

    const backGeo = new T.PlaneGeometry(1.82, 2.44, widthSegments, heightSegments);
    const backPos = backGeo.attributes.position;

    for (let i = 0; i < frontPos.count; i++) {
      const u = (frontPos.getX(i) / 1.82) + 0.5; // 0 (left) to 1 (right)
      const v = (frontPos.getY(i) / 2.44) + 0.5; // 0 (bottom) to 1 (top)

      // Tapering width from pleats at base to shoulder at top
      const taper = 1.0 - (v * 0.22);
      const x = (u - 0.5) * 1.82 * taper;
      const y = (v - 0.5) * 2.44;

      // Elliptical curvature: at u = 0 and u = 1, normU = +-1, so ellipseZ = 0!
      // This guarantees front and back meet continuously at the sides!
      const normU = Math.min(1, Math.max(-1, (u - 0.5) * 2));
      const ellipseZ = Math.sqrt(Math.max(0, 1 - normU * normU)) * 0.36 * taper;

      let frontZ = ellipseZ;

      // Physical 3D pleat undulations in the lower skirt
      if (v < 0.55) {
        const pleatFactor = Math.pow(1 - v / 0.55, 1.2);
        const pleatRipple = Math.sin(u * Math.PI * 18.0) * 0.026 * pleatFactor;
        frontZ += pleatRipple;
      }

      // Diagonal cascading pallu fold
      if (u > 0.42 && v > 0.3) {
        const palluFold = Math.sin((u - 0.42) * Math.PI * 1.6) * 0.020;
        frontZ += Math.max(0, palluFold);
      }

      frontPos.setXYZ(i, x, y, frontZ);
      // Back mesh curves backward and meets front at z = 0 on both edges
      backPos.setXYZ(i, x, y, -ellipseZ * 0.85);
    }

    frontGeo.computeVertexNormals();
    backGeo.computeVertexNormals();
    return { frontGeo, backGeo };
  }, []);

  // Load Authentic Saree Texture & Construct 3D Drape Mesh
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    setIsLoading(true);
    setLoadError(false);

    // Reset camera orientation to hero angle on product change
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.copy(DEFAULT_CAM_POS);
      controlsRef.current.target.copy(DEFAULT_TARGET);
      controlsRef.current.update();
    }

    // Remove previous drape group
    if (drapeGroupRef.current) {
      scene.remove(drapeGroupRef.current);
      drapeGroupRef.current.traverse((child: any) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      drapeGroupRef.current = null;
    }

    // Reset intro rotation
    introRotationCurrentRef.current = -0.12;
    introRotationTargetRef.current = 0.12;
    isIntroAnimatingRef.current = true;

    const textureUrl = product.cutoutImage || product.image;
    const texLoader = new T.TextureLoader();

    texLoader.load(
      textureUrl,
      (texture: any) => {
        texture.colorSpace = T.SRGBColorSpace;
        texture.minFilter = T.LinearMipmapLinearFilter;
        texture.magFilter = T.LinearFilter;
        texture.generateMipmaps = true;

        const drapeGroup = new T.Group();
        drapeGroup.position.set(0, 0, 0);

        const { frontGeo, backGeo } = createVolumetricDrape();

        // 1. Front Curved Drape Mesh with Authentic Pleat Relief
        const frontMat = new T.MeshPhysicalMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.04,
          roughness: 0.38,
          metalness: 0.16,
          clearcoat: 0.28,
          clearcoatRoughness: 0.22,
          sheen: 0.82,
          sheenRoughness: 0.32,
          sheenColor: new T.Color(product.accentColor || '#D4AF37'),
          side: T.FrontSide,
          depthWrite: true,
        });

        const frontMesh = new T.Mesh(frontGeo, frontMat);
        frontMesh.position.set(0, 0, 0);
        frontMesh.castShadow = true;
        frontMesh.receiveShadow = true;
        drapeGroup.add(frontMesh);

        // 2. Rear Volumetric Drape Mesh seamlessly joining at the edges
        const backMat = new T.MeshPhysicalMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.04,
          roughness: 0.44,
          metalness: 0.12,
          sheen: 0.65,
          sheenColor: new T.Color(product.accentColor || '#D4AF37'),
          side: T.BackSide,
          depthWrite: true,
        });

        const backMesh = new T.Mesh(backGeo, backMat);
        backMesh.position.set(0, 0, 0);
        drapeGroup.add(backMesh);

        drapeGroupRef.current = drapeGroup;
        scene.add(drapeGroup);
        setIsLoading(false);
      },
      undefined,
      (err: any) => {
        console.error('Failed to load saree drape texture:', err);
        setLoadError(true);
        setIsLoading(false);
      }
    );
  }, [product.id, product.cutoutImage, product.image, product.accentColor, createVolumetricDrape]);

  return (
    <div
      ref={containerRef}
      className={`product-3d-viewer-container ${className} ${isFullscreen ? 'is-fullscreen' : ''}`}
      aria-label={`Interactive 3D saree viewer for ${product.name}`}
      role="region"
    >
      {/* 3D WebGL Canvas */}
      {!loadError ? (
        <canvas
          ref={canvasRef}
          className="product-3d-canvas"
          aria-label="3D Saree Canvas - Drag to rotate 360 degrees, scroll or pinch to zoom"
        />
      ) : (
        /* Instant Fallback Image if WebGL is unavailable */
        <div className="product-3d-fallback">
          <img
            src={product.cutoutImage || product.image}
            alt={`${product.name} authentic draped silk saree`}
            className="fallback-product-img"
          />
        </div>
      )}

      {/* Floating 3D Interaction Badge & Luxury Showroom Controls */}
      <div className="viewer-controls-overlay">
        {/* 360° Drag Indicator Badge */}
        <div className={`viewer-badge ${isInteracting ? 'active' : ''}`} title="Drag horizontally to inspect saree drape 360°">
          <Rotate3d size={14} className="rotate-badge-icon" />
          <span>360° Interactive</span>
        </div>

        {/* Action Controls */}
        <div className="viewer-actions-group">
          <button
            type="button"
            className="viewer-ctrl-btn"
            onClick={() => handleZoom('in')}
            title="Zoom In (Inspect Weave)"
            aria-label="Zoom In to inspect silk weave"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            className="viewer-ctrl-btn"
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          <button
            type="button"
            className="viewer-ctrl-btn"
            onClick={handleResetView}
            title="Reset Angle & Zoom"
            aria-label="Reset 3D camera view"
          >
            <RefreshCw size={15} />
          </button>

          <button
            type="button"
            className="viewer-ctrl-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="viewer-loading-overlay">
          <div className="viewer-spinner" />
          <span className="viewer-loading-text">Loading Mysore Silk Drape...</span>
        </div>
      )}
    </div>
  );
};
