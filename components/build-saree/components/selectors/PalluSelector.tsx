import { motion } from 'framer-motion';
import { PALLUS } from '../../data/catalog';
import { useCustomizerStore } from '../../store/customizerStore';

export function PalluSelector() {
  const pallu = useCustomizerStore((s) => s.pallu);
  const update = useCustomizerStore((s) => s.update);
  const setHoverRegion = useCustomizerStore((s) => s.setHoverRegion);
  const setCameraView = useCustomizerStore((s) => s.setCameraView);

  return (
    <div className="selector-block">
      <h2 className="step-title">Design Your Pallu</h2>
      <p className="step-sub">The pallu is your signature — make it memorable.</p>

      <div className="card-scroll">
        {PALLUS.map((p) => (
          <motion.button
            key={p.id}
            type="button"
            className={`option-card ${pallu === p.id ? 'selected' : ''}`}
            onMouseEnter={() => {
              setHoverRegion('pallu');
              setCameraView('detail');
            }}
            onMouseLeave={() => {
              setHoverRegion('none');
              setCameraView('front');
            }}
            onClick={() => {
              update({ pallu: p.id });
              setCameraView('front');
            }}
            whileHover={{ y: -2 }}
          >
            <span className="pallu-thumb" data-style={p.id} />
            <strong>{p.name}</strong>
            <em>{p.description}</em>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
