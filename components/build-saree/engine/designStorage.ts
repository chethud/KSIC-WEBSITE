import type { SavedDesign, SareeConfiguration } from '../types/customization';
import { DEFAULT_CONFIGURATION } from '../data/catalog';
import { calculatePrice } from './materialEngine';

const STORAGE_KEY = 'ksic-saree-designs';

function readAll(): Record<string, SavedDesign> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, SavedDesign>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}

export function generateDesignId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `KSIC-${year}-${num}`;
}

export function saveDesign(
  config: SareeConfiguration,
  customerName?: string,
): SavedDesign {
  const designId = config.designId ?? generateDesignId();
  const price = calculatePrice(config).total;
  const record: SavedDesign = {
    designId,
    configuration: { ...config, designId },
    price,
    createdAt: new Date().toISOString(),
    customerName,
  };
  const all = readAll();
  all[designId] = record;
  writeAll(all);
  return record;
}

export function loadDesign(designId: string): SavedDesign | null {
  return readAll()[designId] ?? null;
}

export function encodeConfig(config: SareeConfiguration): string {
  const payload = {
    colorMode: config.colorMode,
    color: config.color,
    secondaryColor: config.secondaryColor,
    shade: config.shade,
    border: config.border,
    borderColor: config.borderColor,
    pallu: config.pallu,
    blouse: config.blouse,
    zari: config.zari,
    finish: config.finish,
    designName: config.designName,
    designId: config.designId,
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

export function decodeConfig(encoded: string): Partial<SareeConfiguration> | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch {
    return null;
  }
}

export function buildShareUrl(config: SareeConfiguration): string {
  const url = new URL(window.location.href);
  url.searchParams.delete('d');
  if (config.designId) {
    url.searchParams.set('design', config.designId);
  } else {
    url.searchParams.set('d', encodeConfig(config));
  }
  return url.toString();
}

export function restoreFromUrl(): Partial<SareeConfiguration> | null {
  const params = new URLSearchParams(window.location.search);
  const designId = params.get('design');
  if (designId) {
    const saved = loadDesign(designId);
    if (saved) return saved.configuration;
  }
  const encoded = params.get('d');
  if (encoded) return decodeConfig(encoded);
  return null;
}

/** Cart handoff payload for existing e-commerce system */
export function buildCartPayload(config: SareeConfiguration) {
  const saved = saveDesign(config);
  return {
    product: 'CUSTOM SAREE',
    designId: saved.designId,
    configuration: saved.configuration,
    price: saved.price,
    summary: [
      saved.configuration.color,
      saved.configuration.border,
      saved.configuration.borderColor,
      saved.configuration.pallu,
      saved.configuration.blouse,
      saved.configuration.zari,
      saved.configuration.finish,
    ],
  };
}

export { DEFAULT_CONFIGURATION };
