import { useMemo, useState } from 'react';
import {
  BORDER_CATEGORIES,
  BORDER_COLORS,
  BORDERS,
  type BorderCategory,
} from '../../data/catalog';
import { useCustomizerStore } from '../../store/customizerStore';

function rupees(amount: number) {
  return `₹ ${Math.round(amount).toLocaleString('en-IN')}`;
}

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

  const selected = BORDERS.find((item) => item.id === border) ?? filtered[0];
  const rail = BORDERS.filter((item) => item.tone === selected?.tone && item.id !== selected?.id).slice(0, 3);
  const colour = BORDER_COLORS.find((item) => item.id === borderColor);

  const choose = (id: string) => {
    update({ border: id });
    setCameraView('detail');
  };

  return (
    <div className="selector-block border-step">
      <p className="border-kicker">Border</p>
      <h2 className="step-title">Choose your border</h2>
      <p className="step-sub">The edge that frames the silk.</p>

      {selected ? (
        <article className="border-feature">
          <header>
            <span>Your border</span>
            <span>{selected.tone}</span>
          </header>
          <div className="border-feature-stage">
            <span className="border-swatch border-swatch--hero" data-style={selected.texture ?? 'classic'} />
            <div className="border-feature-rail">
              {rail.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="border-swatch"
                  data-style={item.texture ?? 'classic'}
                  aria-label={item.name}
                  onClick={() => choose(item.id)}
                  onMouseEnter={() => setHoverRegion('border')}
                  onMouseLeave={() => setHoverRegion('none')}
                />
              ))}
            </div>
          </div>
          <h3>{selected.name}</h3>
          <p className="border-feature-price">{rupees(selected.priceAdjustment)}</p>
          <p className="border-feature-meta">
            {selected.tone}
            {selected.description ? ` · ${selected.description}` : ''}
            {colour ? ` · ${colour.name}` : ''}
          </p>
        </article>
      ) : null}

      <h3 className="border-label">Border colour</h3>
      <div className="border-colours">
        {BORDER_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`border-colour ${borderColor === c.id ? 'is-selected' : ''}`}
            onClick={() => update({ borderColor: c.id })}
            onMouseEnter={() => setHoverRegion('border')}
            onMouseLeave={() => setHoverRegion('none')}
          >
            <span style={{ background: c.hex }} />
            {c.name}
          </button>
        ))}
      </div>

      <label className="border-search">
        <span className="sr-only">Search borders</span>
        <input
          type="search"
          placeholder="Search borders"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="border-families" role="tablist" aria-label="Border families">
        {BORDER_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            className={category === c ? 'is-selected' : ''}
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
        {filtered.map((b) => {
          const active = border === b.id;
          return (
            <button
              key={b.id}
              type="button"
              className={`border-pick ${active ? 'is-selected' : ''}`}
              aria-pressed={active}
              onClick={() => choose(b.id)}
              onMouseEnter={() => setHoverRegion('border')}
              onMouseLeave={() => setHoverRegion('none')}
            >
              <span className="border-pick-radio" aria-hidden />
              <span className="border-swatch border-swatch--row" data-style={b.texture ?? 'classic'} />
              <span className="border-pick-copy">
                <strong>{b.name}</strong>
                <em>{b.description}</em>
              </span>
              <span className="border-pick-price">{rupees(b.priceAdjustment)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
