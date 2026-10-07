export type WishItem = {
  id: string;
  name: string;
  href: string;
  image: string;
  price: number;
  code: string;
};

const KEY = "ksic-wishlist-v1";

function readAll(): WishItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id === "string");
  } catch {
    return [];
  }
}

function writeAll(items: WishItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("ksic:wishlist-changed"));
}

export function readWishlist() {
  return readAll();
}

export function isWished(id: string) {
  return readAll().some((item) => item.id === id);
}

export function addWish(item: WishItem) {
  const items = readAll();
  if (!items.some((entry) => entry.id === item.id)) items.unshift(item);
  writeAll(items);
  return items;
}

export function removeWish(id: string) {
  const next = readAll().filter((item) => item.id !== id);
  writeAll(next);
  return next;
}
