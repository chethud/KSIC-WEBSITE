/** Canvas pattern textures for pallu / border — shared by 3D + preview */

/** Returns a data-URL strip (512×64) for CSS / TextureLoader consumers. */
export function createBorderPattern(
  style: string,
  borderHex: string,
  zariHex: string,
): string {
  return borderPatternCanvas(style, borderHex, zariHex).toDataURL('image/png');
}

/** Draw the border motif strip onto a canvas (reusable by the albedo painter). */
export function borderPatternCanvas(
  style: string,
  borderHex: string,
  zariHex: string,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = borderHex;
  ctx.fillRect(0, 0, 512, 64);
  ctx.fillStyle = zariHex;
  ctx.strokeStyle = zariHex;
  ctx.globalAlpha = 0.85;

  if (style === 'temple') {
    // Gopuram / temple tower rhythm — stacked tiers + peaks
    // Darken the field so zari towers read clearly on the 3D atlas
    const field = borderHex;
    ctx.globalAlpha = 1;
    ctx.fillStyle = field;
    ctx.fillRect(0, 0, 512, 64);
    // deepen field slightly for motif contrast (keep field readable as solid gold)
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.12;
    ctx.fillRect(0, 0, 512, 64);
    ctx.globalAlpha = 1;
    ctx.fillStyle = zariHex;
    ctx.strokeStyle = zariHex;
    for (let x = 0; x < 512; x += 48) {
      ctx.globalAlpha = 0.35;
      ctx.fillRect(x + 4, 8, 40, 48);
      ctx.globalAlpha = 1;
      // base plinth
      ctx.fillRect(x + 6, 48, 36, 10);
      // mid tier
      ctx.fillRect(x + 10, 32, 28, 16);
      // upper tier
      ctx.fillRect(x + 14, 18, 20, 14);
      // gopuram peak
      ctx.beginPath();
      ctx.moveTo(x + 8, 48);
      ctx.lineTo(x + 24, 6);
      ctx.lineTo(x + 40, 48);
      ctx.closePath();
      ctx.fill();
      // finial
      ctx.fillRect(x + 22, 2, 4, 8);
      // side steps
      ctx.globalAlpha = 0.75;
      for (let s = 0; s < 4; s++) {
        ctx.fillRect(x + 8 + s * 2, 44 - s * 6, 32 - s * 4, 3);
      }
    }
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, 54, 512, 4);
    ctx.fillRect(0, 6, 512, 3);
  } else if (style === 'floral') {
    for (let x = 24; x < 512; x += 56) {
      ctx.beginPath();
      ctx.arc(x, 32, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - 8, 28, 4, 0, Math.PI * 2);
      ctx.arc(x + 8, 28, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (style === 'minimal') {
    ctx.fillRect(0, 22, 512, 20);
  } else if (style === 'mysore') {
    for (let y = 10; y < 54; y += 8) ctx.fillRect(0, y, 512, 2);
    for (let x = 20; x < 512; x += 72) {
      ctx.beginPath();
      ctx.ellipse(x, 32, 14, 20, 0, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  } else if (style === 'paisley') {
    for (let x = 28; x < 512; x += 48) {
      ctx.beginPath();
      ctx.ellipse(x, 34, 10, 16, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 6, 20, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (style === 'peacock') {
    for (let x = 32; x < 512; x += 52) {
      ctx.beginPath();
      ctx.ellipse(x, 36, 12, 18, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, 34, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, 18);
      ctx.lineTo(x - 8, 8);
      ctx.lineTo(x + 8, 8);
      ctx.closePath();
      ctx.fill();
    }
  } else if (style === 'geometric') {
    for (let x = 0; x < 512; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x + 18, 10);
      ctx.lineTo(x + 32, 32);
      ctx.lineTo(x + 18, 54);
      ctx.lineTo(x + 4, 32);
      ctx.closePath();
      ctx.stroke();
    }
  } else if (style === 'checks') {
    const size = 12;
    for (let y = 8; y < 56; y += size) {
      for (let x = 0; x < 512; x += size) {
        if ((x / size + y / size) % 2 === 0) {
          ctx.fillRect(x, y, size, size);
        }
      }
    }
  } else if (style === 'vine') {
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 8) {
      const y = 32 + Math.sin(x / 28) * 14;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    for (let x = 24; x < 512; x += 40) {
      ctx.beginPath();
      ctx.ellipse(x, 32 + Math.sin(x / 28) * 14, 6, 4, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    for (let y = 12; y < 52; y += 8) ctx.fillRect(0, y, 512, 2);
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = zariHex;
  ctx.fillRect(0, 0, 512, 3);
  ctx.fillRect(0, 61, 512, 3);
  return canvas;
}

/** Pixel buffer for painting the border strip into the GLB albedo atlas. */
export function borderPatternImageData(
  style: string,
  borderHex: string,
  zariHex: string,
): ImageData {
  const canvas = borderPatternCanvas(style, borderHex, zariHex);
  return canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
}

export function createPalluPattern(
  style: string,
  baseHex: string,
  zariHex: string,
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 384);
  ctx.strokeStyle = zariHex;
  ctx.fillStyle = zariHex;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 2;

  const drawMotif = (x: number, y: number) => {
    if (style === 'minimal') {
      ctx.fillRect(20, y, 216, 3);
      return;
    }
    if (style === 'statement') {
      ctx.beginPath();
      ctx.moveTo(x, y - 24);
      ctx.lineTo(x + 24, y);
      ctx.lineTo(x, y + 24);
      ctx.lineTo(x - 24, y);
      ctx.closePath();
      ctx.stroke();
      return;
    }
    ctx.beginPath();
    ctx.ellipse(x, y, 18, 28, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const rows = style === 'royal' ? 5 : style === 'minimal' ? 3 : 4;
  const cols = style === 'royal' ? 3 : 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      drawMotif(64 + c * 96, 50 + r * 70);
    }
  }

  ctx.globalAlpha = 0.7;
  for (let y = 16; y < 384; y += style === 'royal' ? 36 : 56) {
    ctx.fillRect(0, y, 256, 2);
  }

  return canvas.toDataURL('image/png');
}

export function silkGradient(hex: string, sheen: number, accentHex?: string): string {
  const alpha = Math.round(30 + sheen * 50);
  if (accentHex && accentHex.toLowerCase() !== hex.toLowerCase()) {
    return `linear-gradient(160deg, ${hex} 0%, ${hex} 28%, ${accentHex} 72%, ${accentHex} 100%), linear-gradient(135deg, transparent 40%, rgba(255,245,230,${alpha / 255}) 52%, transparent 70%)`;
  }
  return `linear-gradient(135deg, ${hex} 0%, ${hex}aa 40%, rgba(255,245,230,${alpha / 255}) 52%, ${hex} 70%, ${hex}dd 100%)`;
}
