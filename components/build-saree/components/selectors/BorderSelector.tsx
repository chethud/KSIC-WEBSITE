import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BORDER_CATEGORIES,
  BORDER_COLORS,
  BORDERS,
  type BorderCategory,
} from '../../data/catalog';
import { useCustomizerStore } from '../../store/customizerStore';

export function BorderSelector() {
  const border = useCustomizerStore((s) => s.border);
  const borderColor = useCustomizerStore((s) => s.borderColor);
  const update = useCustomizerStore((s) => s.update);
  const setHoverRegion = useCustomizerStore((s) => s.setHoverRegion);
  const setCameraView = useCustomizerStore((s) => s.setCameraView);
  const [category, setCategory] = useState<BorderCategory>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BORDERS.filter((b) => {
      if (category !== 'All' && b.tone !== category) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        (b.description?.toLowerCase().includes(q) ?? false) ||
        (b.tone?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [category, query]);

  return (
    <div className="selector-block">
      <h2 className="step-title">Define Your Border</h2>
      <p className="step-sub">
        {BORDERS.length}+ borders — search or filter by family, then pick its character.
      </p>

      <label className="border-search">
        <span className="sr-only">Search borders</span>
        <input
          type="search"
          placeholder="Search borders…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="chip-row wrap border-category-row">
        {BORDER_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip ${category === c ? 'selected' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="border-count" aria-live="polite">
        Showing {filtered.length} of {BORDERS.length}
      </p>

      <div className="border-grid">
        {filtered.map((b) => (
          <motion.button
            key={b.id}
            type="button"
            className={`option-card border-card ${border === b.id ? 'selected' : ''}`}
            onClick={() => {
              update({ border: b.id });
              setCameraView('detail');
            }}
            onMouseEnter={() => setHoverRegion('border')}
            onMouseLeave={() => setHoverRegion('none')}
            whileHover={{ y: -2 }}
          >
            <span className="border-thumb" data-style={b.texture ?? 'classic'} />
            <strong>{b.name}</strong>
            <em>{b.description}</em>
          </motion.button>
        ))}
      </div>

      <h3 className="field-label">Border Colour</h3>
      <div className="chip-row wrap">
        {BORDER_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`chip color-chip ${borderColor === c.id ? 'selected' : ''}`}
            onClick={() => update({ borderColor: c.id })}
            onMouseEnter={() => setHoverRegion('border')}
            onMouseLeave={() => setHoverRegion('none')}
          >
            <span className="mini-swatch" style={{ background: c.hex }} />
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
