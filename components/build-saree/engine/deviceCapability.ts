import type { RenderMode } from '../types/customization';

export interface CapabilityReport {
  mode: RenderMode;
  webgl: boolean;
  reason: string;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function isLowEndDevice(): boolean {
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 4;
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection?.saveData;

  if (saveData) return true;
  if (typeof mem === 'number' && mem <= 2) return true;
  if (isMobile && cores <= 4 && (typeof mem !== 'number' || mem <= 4)) return true;
  return false;
}

/** Prefer WebGL when capable; otherwise Interactive Preview — never an error state */
export function detectRenderCapability(): CapabilityReport {
  if (!hasWebGL()) {
    return { mode: 'preview', webgl: false, reason: 'webgl-unavailable' };
  }
  if (isLowEndDevice()) {
    return { mode: 'preview', webgl: true, reason: 'optimized-for-device' };
  }
  return { mode: 'webgl', webgl: true, reason: 'ok' };
}

/** Call after a few frames if FPS is poor — switch to preview seamlessly */
export function shouldDowngradeFromFps(fps: number): boolean {
  return fps > 0 && fps < 28;
}
