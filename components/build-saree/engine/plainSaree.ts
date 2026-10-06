/**
 * Step 1 — plain silk albedo compositor (CASE D atlas).
 *
 * Logical layers (colour step):
 *   SAREE_BASE        → VISIBLE  (paint mask → solid sareeBaseColor)
 *   SAREE_BORDER      → HIDDEN   (included in paint → overwritten)
 *   SAREE_PALLU_DESIGN→ HIDDEN   (included in paint → overwritten)
 *   SAREE_ZARI        → HIDDEN   (included in paint → overwritten)
 *   HUMAN / BLOUSE    → LOCKED   (human_lock → baseline verbatim)
 *
 * NEVER: OriginalTexture × selectedColour (that keeps orange/red artwork).
 * Paint texels are fully replaced with a clean solid colour.
 * Fold shading comes from the material normal map + lighting, not artwork chroma.
 */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function sourceSize(img: CanvasImageSource): { w: number; h: number } {
  if ('naturalWidth' in img) {
    const el = img as HTMLImageElement;
    return { w: el.naturalWidth || el.width, h: el.naturalHeight || el.height };
  }
  const bmp = img as ImageBitmap;
  return { w: bmp.width, h: bmp.height };
}

function readMask(
  src: CanvasImageSource,
  width: number,
  height: number,
): Uint8ClampedArray {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height).data;
}

/**
 * Build a CLEAN plain-silk albedo for sareeBaseColor.
 * Human-lock texels are bitwise-copied from the baseline atlas.
 * Paint texels (fabric + border + design + zari + pallu art) become solid colour.
 */
export function composePlainSilkAlbedo(
  baselineImage: CanvasImageSource,
  paintMaskImage: CanvasImageSource,
  humanLockImage: CanvasImageSource,
  sareeHex: string,
): HTMLCanvasElement {
  const { w, h } = sourceSize(baselineImage);
  const width = w || 1024;
  const height = h || 1024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(baselineImage, 0, 0, width, height);
  const img = ctx.getImageData(0, 0, width, height);
  const data = img.data;
  const baseline = new Uint8ClampedArray(data);

  const paint = readMask(paintMaskImage, width, height);
  const human = readMask(humanLockImage, width, height);
  const [tr, tg, tb] = hexToRgb(sareeHex);

  for (let i = 0; i < data.length; i += 4) {
    // HARD LOCK — face, skin, hands, hair, jewellery (never touch)
    if (human[i] > 127) {
      data[i] = baseline[i];
      data[i + 1] = baseline[i + 1];
      data[i + 2] = baseline[i + 2];
      data[i + 3] = baseline[i + 3];
      continue;
    }

    // SAREE_BASE only — full replace, no artwork multiply
    if (paint[i] > 127) {
      // Mild fold cue from luminance only (desaturated); kill chroma patterns
      const L =
        (0.2126 * baseline[i] +
          0.7152 * baseline[i + 1] +
          0.0722 * baseline[i + 2]) /
        255;
      // Tight range so orange/red motifs cannot reappear as shade stripes
      const shade = 0.78 + 0.28 * Math.min(1, Math.max(0, (L - 0.15) / 0.7));
      data[i] = Math.min(255, Math.round(tr * shade));
      data[i + 1] = Math.min(255, Math.round(tg * shade));
      data[i + 2] = Math.min(255, Math.round(tb * shade));
      // keep alpha
      continue;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas;
}
