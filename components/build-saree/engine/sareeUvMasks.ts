/**
 * UV masks aligned with clipSareeByHumanMask sampling (same flipY rules).
 */
import * as THREE from 'three';

function readPixels(image: TexImageSource): {
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

function sampleChannel(
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

/**
 * Per-texel alpha for Saree_Base fragments: white = show tinted silk, black = discard.
 * Hides saree mesh overlap on face/hands even when geometry split is imperfect.
 */
export function buildSareeFragmentAlphaMap(
  humanMask: TexImageSource,
  paintMask: TexImageSource,
  flipY: boolean,
): THREE.CanvasTexture {
  const human = readPixels(humanMask);
  const paint = readPixels(paintMask);
  const w = human.width;
  const h = human.height;
  const out = new Uint8ClampedArray(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = (x + 0.5) / w;
      const v = (y + 0.5) / h;
      const hv = sampleChannel(human.data, w, h, u, v, flipY);
      const pv = sampleChannel(paint.data, paint.width, paint.height, u, v, flipY);
      /** Discard anywhere human UV — saree mesh must not paint face/hands. */
      const fabric = hv < 0.35 && pv > 0.2;
      const alpha = fabric ? 255 : 0;
      const i = (y * w + x) * 4;
      out[i] = alpha;
      out[i + 1] = alpha;
      out[i + 2] = alpha;
      out[i + 3] = 255;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.putImageData(new ImageData(out, w, h), 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.NoColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export function getSareeMeshUvFlipY(root: THREE.Object3D): boolean {
  let flipY = false;
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.name === 'Saree_Base') {
      flipY = obj.userData.ksicUvFlipY === true;
    }
  });
  return flipY;
}
