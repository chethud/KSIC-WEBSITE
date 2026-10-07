export type Address = {
  id: string;
  label: "Home" | "Work" | "Other";
  name: string;
  phone: string;
  pin: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
};

const KEY = "ksic-addresses-v1";

export function readAddresses(): Address[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAddress(address: Omit<Address, "id"> & { id?: string }) {
  const items = readAddresses();
  const id = address.id ?? `addr-${Date.now()}`;
  const next = { ...address, id };
  const index = items.findIndex((item) => item.id === id);
  if (index >= 0) items[index] = next;
  else items.push(next);
  localStorage.setItem(KEY, JSON.stringify(items));
  return next;
}

export function removeAddress(id: string) {
  const next = readAddresses().filter((item) => item.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
