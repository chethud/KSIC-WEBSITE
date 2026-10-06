import { useMemo } from 'react';
import { useCustomizerStore } from '../store/customizerStore';
import { buildSummaryLines, calculatePrice, formatINR } from '../engine/materialEngine';

export function DesignSummary() {
  const config = useCustomizerStore();
  const lines = useMemo(() => buildSummaryLines(config), [
    config.color,
    config.shade,
    config.border,
    config.borderColor,
    config.pallu,
    config.blouse,
    config.zari,
    config.finish,
  ]);
  const price = useMemo(() => calculatePrice(config), [
    config.color,
    config.border,
    config.borderColor,
    config.pallu,
    config.blouse,
    config.zari,
    config.finish,
  ]);

  return (
    <aside className="design-summary" aria-live="polite">
      <p className="summary-eyebrow">Your design</p>
      {config.designName && <p className="summary-name">{config.designName}</p>}
      <ul>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="summary-price">
        <span>From</span>
        <strong>{formatINR(price.total)}</strong>
      </div>
    </aside>
  );
}
