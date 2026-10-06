import { useCustomizerStore } from '../store/customizerStore';

export function Header() {
  const bagCount = useCustomizerStore((s) => s.bagCount);
  const modelEditMode = useCustomizerStore((s) => s.modelEditMode);
  const toggleModelEditMode = useCustomizerStore((s) => s.toggleModelEditMode);
  const saveCurrentDesign = useCustomizerStore((s) => s.saveCurrentDesign);

  return (
    <header className="studio-header">
      <a className="brand" href="/" aria-label="Mysore Silk home">
        <span className="brand-mark" aria-hidden />
        <span className="brand-name">MYSORE SILK</span>
      </a>
      <nav className="header-nav" aria-label="Primary">
        <a className="header-nav-item active" href="/your-saree">
          Build Your Saree
        </a>
        <a className="header-nav-item" href="/#collection">
          Collection
        </a>
        <a className="header-nav-item" href="/heritage">
          Heritage
        </a>
      </nav>
      <div className="header-actions">
        <button
          type="button"
          className={`ghost-btn edit-model-btn${modelEditMode ? ' is-active' : ''}`}
          aria-pressed={modelEditMode}
          onClick={() => toggleModelEditMode()}
        >
          {modelEditMode ? 'Editing model' : 'Edit model'}
        </button>
        <button type="button" className="ghost-btn" onClick={() => saveCurrentDesign()}>
          Save
        </button>
        <button type="button" className="bag-btn" aria-label={`Bag, ${bagCount} items`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 8h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M9 8V6.5A3 3 0 0 1 12 3.5v0a3 3 0 0 1 3 3V8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          {bagCount > 0 && <span className="bag-count">{bagCount}</span>}
        </button>
      </div>
    </header>
  );
}
