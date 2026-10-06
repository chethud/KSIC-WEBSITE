import { BLOUSES } from '../../data/catalog';
import { useCustomizerStore } from '../../store/customizerStore';

export function BlouseSelector() {
  const blouse = useCustomizerStore((s) => s.blouse);
  const update = useCustomizerStore((s) => s.update);
  const setHoverRegion = useCustomizerStore((s) => s.setHoverRegion);
  const setCameraView = useCustomizerStore((s) => s.setCameraView);

  return (
    <div className="selector-block">
      <h2 className="step-title">Complete the Look</h2>
      <p className="step-sub">A refined blouse finishes your creation.</p>

      <div className="chip-row wrap">
        {BLOUSES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`chip ${blouse === m.id ? 'selected' : ''}`}
            onClick={() => {
              update({ blouse: m.id });
              setCameraView('detail');
            }}
            onMouseEnter={() => setHoverRegion('blouse')}
            onMouseLeave={() => setHoverRegion('none')}
          >
            {m.name}
          </button>
        ))}
      </div>
    </div>
  );
}
