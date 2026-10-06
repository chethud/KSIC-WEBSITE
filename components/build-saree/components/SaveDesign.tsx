import { useCustomizerStore } from '../store/customizerStore';

export function SaveDesign() {
  const designId = useCustomizerStore((s) => s.designId);
  const designName = useCustomizerStore((s) => s.designName);
  const setDesignName = useCustomizerStore((s) => s.setDesignName);
  const saveCurrentDesign = useCustomizerStore((s) => s.saveCurrentDesign);

  return (
    <div className="save-design">
      <h3 className="field-label">Name</h3>
      <input
        className="name-input"
        type="text"
        placeholder="My Mysore Royal"
        value={designName}
        onChange={(e) => setDesignName(e.target.value)}
        maxLength={40}
      />
      <button type="button" className="secondary-cta" onClick={() => saveCurrentDesign()}>
        Save Design
      </button>
      {designId && (
        <p className="design-id">
          ID <strong>{designId}</strong>
        </p>
      )}
    </div>
  );
}
