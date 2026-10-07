export type BagItem = {
  id: string;
  name: string;
  detail: string;
  href: string;
  image: string;
  price: number;
  qty: number;
};

const KEY = "ksic-bag-v1";

function canStore() {
  return typeof window !== "undefined";
}

export function readBag(): BagItem[] {
  if (!canStore()) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && typeof item.id === "string" && typeof item.name === "string"
    );
  } catch {
    return [];
  }
}

function writeBag(items: BagItem[]) {
  if (!canStore()) return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("ksic:bag-changed"));
}

export function addBagItem(item: Omit<BagItem, "qty"> & { qty?: number }) {
  const items = readBag();
  const qty = Math.max(1, item.qty ?? 1);
  const existing = items.find((entry) => entry.id === item.id);
  if (existing) {
    existing.qty = Math.min(9, existing.qty + qty);
  } else {
    items.push({ ...item, qty: Math.min(9, qty) });
  }
  writeBag(items);
  return items;
}

export function setBagQty(id: string, qty: number) {
  const next = qty < 1 ? readBag().filter((item) => item.id !== id) : readBag().map((item) =>
    item.id === id ? { ...item, qty: Math.min(9, qty) } : item
  );
  writeBag(next);
  return next;
}

export function removeBagItem(id: string) {
  const next = readBag().filter((item) => item.id !== id);
  writeBag(next);
  return next;
}

export function clearBag() {
  writeBag([]);
  return [];
}

export function bagUnits(items: BagItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function bagTotal(items: BagItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function formatInr(amount: number) {
  return `₹ ${Math.round(amount).toLocaleString("en-IN")}`;
}

export function parseInr(label: string) {
  const amount = Number(label.replace(/[^\d]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}
