import { bagTotal, clearBag, readBag, type BagItem } from "@/lib/bag";

export type PlacedOrder = {
  id: string;
  email: string;
  placed: string;
  status: "Placed";
  items: BagItem[];
  total: number;
};

const KEY = "ksic-orders-v1";

function readAll(): PlacedOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((order) => order && typeof order.id === "string" && typeof order.email === "string");
  } catch {
    return [];
  }
}

export function readOrders(email: string) {
  return readAll().filter((order) => order.email === email.toLowerCase());
}

export function placeOrder(email: string, items: BagItem[] = readBag()): PlacedOrder | null {
  if (!items.length) return null;
  const order: PlacedOrder = {
    id: `MS-${Date.now().toString().slice(-6)}`,
    email: email.toLowerCase(),
    placed: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    status: "Placed",
    items,
    total: bagTotal(items),
  };
  const next = [order, ...readAll()];
  localStorage.setItem(KEY, JSON.stringify(next));
  clearBag();
  return order;
}
