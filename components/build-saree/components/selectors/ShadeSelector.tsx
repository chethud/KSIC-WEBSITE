import { SHADES } from '../../data/catalog';
import { useCustomizerStore } from '../../store/customizerStore';

export function ShadeSelector() {
  const shade = useCustomizerStore((s) => s.shade);
  const update = useCustomizerStore((s) => s.update);

  return (
    <div className="selector-block shade-block">
      <h3 className="field-label">Adjust Shade</h3>
      <div className="chip-row">
        {SHADES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`chip ${shade === s.id ? 'selected' : ''}`}
            onClick={() => update({ shade: s.id })}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="shade-track" aria-hidden>
        <span>Light</span>
        <div className="shade-dots">
          {SHADES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`shade-dot ${shade === s.id ? 'active' : ''}`}
              onClick={() => update({ shade: s.id })}
              aria-label={s.name}
            />
          ))}
        </div>
        <span>Deep</span>
      </div>
    </div>
  );
}
