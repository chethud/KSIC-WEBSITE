export type Account = {
  name: string;
  email: string;
  since: string;
};

const KEY = "ksic-account-v1";

function canStore() {
  return typeof window !== "undefined";
}

export function readAccount(): Account | null {
  if (!canStore()) return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!parsed || typeof parsed.email !== "string" || typeof parsed.name !== "string") return null;
    return parsed as Account;
  } catch {
    return null;
  }
}

export function signIn(name: string, email: string): Account {
  const account: Account = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    since: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
  };
  const existing = readAccount();
  if (existing && existing.email === account.email) {
    account.since = existing.since;
    account.name = account.name || existing.name;
  }
  localStorage.setItem(KEY, JSON.stringify(account));
  window.dispatchEvent(new Event("ksic:account-changed"));
  return account;
}

export function signOut() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("ksic:account-changed"));
}
