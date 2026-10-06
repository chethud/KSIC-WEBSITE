import { useMemo } from 'react';
import { useCustomizerStore } from '../store/customizerStore';
import { calculatePrice, formatINR } from '../engine/materialEngine';
import { BASE_PRICE } from '../data/catalog';

export function PriceSummary() {
  const config = useCustomizerStore();
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
    <div className="price-summary">
      <p className="price-title">Price</p>
      <div className="price-rows">
        <div>
          <span>Base saree</span>
          <span>{formatINR(BASE_PRICE)}</span>
        </div>
        {price.adjustments.map((a) => (
          <div key={a.label}>
            <span>{a.label}</span>
            <span>+{formatINR(a.amount)}</span>
          </div>
        ))}
        <div className="price-total">
          <span>Total</span>
          <strong>{formatINR(price.total)}</strong>
        </div>
      </div>
    </div>
  );
}
