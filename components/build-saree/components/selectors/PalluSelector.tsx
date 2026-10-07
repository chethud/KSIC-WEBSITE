import Image from "next/image";
import { PALLUS } from "../../data/catalog";
import { useCustomizerStore } from "../../store/customizerStore";

export function PalluSelector() {
  const pallu = useCustomizerStore((s) => s.pallu);
  const update = useCustomizerStore((s) => s.update);
  const setHoverRegion = useCustomizerStore((s) => s.setHoverRegion);
  const setCameraView = useCustomizerStore((s) => s.setCameraView);
  const selected = PALLUS.find((item) => item.id === pallu) ?? PALLUS[0];

  return (
    <div className="selector-block pallu-step">
      <h2 className="step-title">Design Your Pallu</h2>
      <p className="step-sub">The pallu is your signature — make it memorable.</p>

      <div className="pallu-rail" role="listbox" aria-label="Pallu designs">
        {PALLUS.map((item) => {
          const active = pallu === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={active}
              className={`pallu-card${active ? " is-selected" : ""}`}
              onMouseEnter={() => setHoverRegion("pallu")}
              onMouseLeave={() => setHoverRegion("none")}
              onClick={() => {
                update({ pallu: item.id });
                setCameraView("front");
              }}
            >
              <span className="pallu-card-media">
                {item.fabricImage ? (
                  <Image src={item.fabricImage} alt="" fill sizes="140px" />
                ) : null}
                {active && (
                  <span className="pallu-card-check" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                      <path d="M5 12.5 10 17l9-10" />
                    </svg>
                  </span>
                )}
              </span>
              <span className="pallu-card-copy">
                <strong>{item.name}</strong>
                <em>{item.description}</em>
              </span>
            </button>
          );
        })}
      </div>

      {selected.fabricImage ? (
        <figure className="pallu-stage">
          <Image src={selected.fabricImage} alt="" fill sizes="520px" />
          <button
            type="button"
            className="pallu-stage-detail"
            onClick={() => setCameraView("detail")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16.5 20 20.5" strokeLinecap="round" />
            </svg>
            View detail
          </button>
          <figcaption>
            <strong>{selected.name}</strong>
            <span>{selected.description}</span>
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
