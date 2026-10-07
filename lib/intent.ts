import { addBagItem, type BagItem } from "@/lib/bag";
import { readAccount } from "@/lib/account";
import { placeOrder } from "@/lib/orders";
import { addWish, type WishItem } from "@/lib/wishlist";

export type BagDraft = Omit<BagItem, "qty">;

export type Intent =
  | { type: "add-bag"; item: BagDraft; next: string }
  | { type: "buy-now"; item: BagDraft; next: string }
  | { type: "wishlist"; item: WishItem; next: string }
  | { type: "save-creation"; next: string }
  | { type: "checkout"; next: string }
  | { type: "place-order"; next: string };

const KEY = "ksic-intent-v1";

export function readIntent(): Intent | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!parsed || typeof parsed.type !== "string" || typeof parsed.next !== "string") return null;
    return parsed as Intent;
  } catch {
    return null;
  }
}

export function clearIntent() {
  localStorage.removeItem(KEY);
}

export function takeIntent() {
  const intent = readIntent();
  clearIntent();
  return intent;
}

export function applyIntent(intent: Intent) {
  if (intent.type === "add-bag" || intent.type === "buy-now") addBagItem(intent.item);
  if (intent.type === "wishlist") addWish(intent.item);
  if (intent.type === "save-creation") window.dispatchEvent(new Event("ksic:resume-save"));
  if (intent.type === "place-order") {
    const account = readAccount();
    if (account) placeOrder(account.email);
  }
}

const guestActions = new Set<Intent["type"]>(["add-bag", "buy-now", "checkout"]);

/** Returns true when the action ran now. Otherwise the sign-in dialog opens. */
export function beginIntent(intent: Intent) {
  if (!readAccount() && !guestActions.has(intent.type)) {
    localStorage.setItem(KEY, JSON.stringify(intent));
    window.dispatchEvent(new Event("ksic:auth-needed"));
    return false;
  }
  applyIntent(intent);
  return true;
}
