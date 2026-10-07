import Image from 'next/image';
import { FINISHES } from '../../data/catalog';
import { useCustomizerStore } from '../../store/customizerStore';

export function FinishSelector() {
  const finish = useCustomizerStore((s) => s.finish);
  const update = useCustomizerStore((s) => s.update);
  const setCameraView = useCustomizerStore((s) => s.setCameraView);

  return (
    <div className="selector-block">
      <h2 className="step-title">Final Touch</h2>
      <p className="step-sub">How light moves across your silk.</p>

      <div className="finish-list">
        {FINISHES.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`finish-row ${finish === f.id ? 'selected' : ''}`}
            onClick={() => {
              update({ finish: f.id });
              setCameraView('detail');
            }}
          >
            <span className="finish-preview">
              {f.fabricImage ? (
                <Image src={f.fabricImage} alt="" fill sizes="46px" />
              ) : null}
            </span>
            <span>
              <strong>{f.name}</strong>
              <em>{f.description}</em>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
