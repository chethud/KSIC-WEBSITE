import { useMemo } from 'react';
import { useCustomizerStore } from '../../store/customizerStore';
import { resolveMaterials } from '../../engine/materialEngine';
import { createBorderPattern, createPalluPattern, silkGradient } from '../../engine/textures';
import { borderTextureOf } from '../../data/catalog';
import type { CameraView } from '../../types/customization';

const VIEW_TRANSFORM: Record<CameraView, string> = {
  front: 'scaleX(1) rotateY(0deg)',
  'three-quarter': 'scaleX(1) rotateY(-18deg)',
  side: 'scaleX(0.72) rotateY(-55deg)',
  back: 'scaleX(-1) rotateY(8deg)',
  detail: 'scale(1.35) translateY(8%)',
};

/**
 * Interactive Preview — layered compositing of a fixed fashion illustration.
 * Same configuration drives every layer. Feels intentional, not like a broken 3D mode.
 */
export function InteractivePreview() {
  const config = useCustomizerStore();
  const materials = useMemo(() => resolveMaterials(config), [config]);
  const cameraView = useCustomizerStore((s) => s.cameraView);
  const hover = useCustomizerStore((s) => s.hoverRegion);

  const borderPattern = useMemo(
    () =>
      createBorderPattern(
        borderTextureOf(config.border),
        materials.borderHex,
        materials.zariHex,
      ),
    [config.border, materials.borderHex, materials.zariHex],
  );

  const palluPattern = useMemo(
    () =>
      createPalluPattern(
        materials.palluPattern,
        materials.palluHex,
        materials.zariHex,
      ),
    [materials.palluPattern, materials.palluHex, materials.zariHex],
  );

  const sareeFill = silkGradient(
    materials.sareeHex,
    materials.sareeSheen,
    materials.multiGradient ? materials.sareeAccentHex : undefined,
  );
  const highlight = (region: typeof hover) =>
    hover === region ? 'preview-highlight' : '';

  return (
    <div className="interactive-preview" aria-label="Interactive saree preview">
      <div className="preview-stage">
        <div
          className="preview-figure"
          style={{ transform: VIEW_TRANSFORM[cameraView] }}
        >
          {/* Soft studio ground */}
          <div className="preview-ground" />

          {/* Hair */}
          <div className="layer layer-hair" />

          {/* Head / neck / arms (skin) */}
          <div className="layer layer-skin" />

          {/* Blouse */}
          <div
            className={`layer layer-blouse ${highlight('blouse')}`}
            style={{ background: materials.blouseHex }}
          />

          {/* Saree body */}
          <div
            className="layer layer-saree"
            style={{ background: sareeFill }}
          />

          {/* Pleat suggestion */}
          <div
            className="layer layer-pleats"
            style={{
              background: materials.multiGradient
                ? `repeating-linear-gradient(90deg, transparent 0 7px, ${materials.sareeHex}44 7px 8px, transparent 8px 14px, ${materials.sareeAccentHex}44 14px 15px)`
                : `repeating-linear-gradient(90deg, transparent 0 7px, ${materials.sareeHex}55 7px 8px)`,
            }}
          />

          {/* Pallu */}
          <div
            className={`layer layer-pallu ${highlight('pallu')}`}
            style={{
              backgroundImage: `url(${palluPattern}), linear-gradient(160deg, ${materials.palluHex}, ${materials.sareeHex})`,
              backgroundSize: 'cover, cover',
              boxShadow:
                hover === 'pallu'
                  ? `0 0 0 2px ${materials.zariHex}88`
                  : undefined,
            }}
          />

          {/* Border hem */}
          <div
            className={`layer layer-border ${highlight('border')}`}
            style={{
              backgroundImage: `url(${borderPattern})`,
              backgroundSize: 'cover',
              height: '7%',
            }}
          />

          {/* Zari accents */}
          <div
            className={`layer layer-zari ${highlight('zari')}`}
            style={{
              borderColor: materials.zariHex,
              boxShadow: `inset 0 0 0 1px ${materials.zariHex}aa`,
            }}
          />

          {/* Motif dots */}
          {materials.palluPattern !== 'minimal' && (
            <div className="layer layer-motifs" aria-hidden>
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    background: materials.zariHex,
                    left: `${28 + (i % 4) * 12}%`,
                    top: `${48 + Math.floor(i / 4) * 10}%`,
                    opacity: 0.45 + materials.zariIntensity * 0.4,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="preview-mode-label">Interactive Preview</p>
    </div>
  );
}
