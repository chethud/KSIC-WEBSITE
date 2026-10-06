import {
  ASSIGN_BRUSHES,
  ASSIGN_BRUSH_SIZES,
  BRUSH_RADIUS_MAX,
  BRUSH_RADIUS_MIN,
  type AssignBrush,
} from '../../engine/regionAssign';
import { useCustomizerStore } from '../../store/customizerStore';

type AssignBarProps = {
  onReset: () => void;
  onSave: () => void;
  onToggleMap: () => void;
  mapOn: boolean;
};

export function RegionAssignBar({
  onReset,
  onSave,
  onToggleMap,
  mapOn,
}: AssignBarProps) {
  const modelEditMode = useCustomizerStore((s) => s.modelEditMode);
  const assignBrush = useCustomizerStore((s) => s.assignBrush);
  const assignBrushRadius = useCustomizerStore((s) => s.assignBrushRadius);
  const setAssignBrush = useCustomizerStore((s) => s.setAssignBrush);
  const setAssignBrushRadius = useCustomizerStore((s) => s.setAssignBrushRadius);
  const setModelEditMode = useCustomizerStore((s) => s.setModelEditMode);

  if (!modelEditMode) return null;

  return (
    <div className="region-assign-bar" role="toolbar" aria-label="Assign saree parts">
      <p className="region-assign-title">Assign parts</p>
      <p className="region-assign-hint">
        Paint stays on this model and on the main saree. One finger paints · two fingers
        zoom and rotate · right-drag rotates.
      </p>

      <div className="region-assign-row">
        <span className="region-assign-label">Part</span>
        <div className="region-assign-brushes">
          {ASSIGN_BRUSHES.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`region-assign-chip${assignBrush === b.id ? ' is-active' : ''}`}
              data-brush={b.id}
              title={b.hint}
              aria-pressed={assignBrush === b.id}
              onClick={() => setAssignBrush(b.id as AssignBrush)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="region-assign-row">
        <div className="region-assign-label-row">
          <span className="region-assign-label">Brush size</span>
          <span className="region-assign-size-value" aria-live="polite">
            {assignBrushRadius}px
          </span>
        </div>
        <div className="region-assign-brushes size-picks" role="group" aria-label="Brush size">
          {ASSIGN_BRUSH_SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`region-assign-chip size-chip${
                assignBrushRadius === s.radius ? ' is-active' : ''
              }`}
              title={`${s.hint} (${s.radius}px)`}
              aria-pressed={assignBrushRadius === s.radius}
              onClick={() => setAssignBrushRadius(s.radius)}
            >
              <span
                className="brush-dot"
                style={{
                  width: `${Math.max(4, Math.min(18, s.radius * 0.35))}px`,
                  height: `${Math.max(4, Math.min(18, s.radius * 0.35))}px`,
                }}
                aria-hidden
              />
              {s.label}
            </button>
          ))}
        </div>
        <label className="region-assign-slider">
          <span className="visually-hidden">Brush radius</span>
          <input
            type="range"
            min={BRUSH_RADIUS_MIN}
            max={BRUSH_RADIUS_MAX}
            step={1}
            value={assignBrushRadius}
            onChange={(e) => setAssignBrushRadius(Number(e.target.value))}
            aria-valuemin={BRUSH_RADIUS_MIN}
            aria-valuemax={BRUSH_RADIUS_MAX}
            aria-valuenow={assignBrushRadius}
            aria-label={`Brush size ${assignBrushRadius} pixels`}
          />
          <span className="region-assign-slider-ends" aria-hidden>
            <span>{BRUSH_RADIUS_MIN}</span>
            <span>{BRUSH_RADIUS_MAX}</span>
          </span>
        </label>
      </div>

      <div className="region-assign-actions">
        <button type="button" className="ghost-btn" onClick={onToggleMap}>
          {mapOn ? 'Hide map' : 'Show map'}
        </button>
        <button
          type="button"
          className="ghost-btn"
          title="Discard paint since last Save (keeps your saved map)"
          onClick={onReset}
        >
          Reset unsaved
        </button>
        <button
          type="button"
          className="ghost-btn"
          title="Save this map — Colour only paints your main saree"
          onClick={onSave}
        >
          Save map
        </button>
        <button
          type="button"
          className="primary-cta region-assign-done"
          onClick={() => setModelEditMode(false)}
        >
          Done
        </button>
      </div>
    </div>
  );
}
