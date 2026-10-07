"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readAccount, signIn, signOut, type Account } from "@/lib/account";
import { applyIntent, takeIntent } from "@/lib/intent";

function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return letters || "MS";
}

export default function AccountView() {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const refresh = () => {
    setAccount(readAccount());
    setReady(true);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("ksic:account-changed", refresh);
    return () => window.removeEventListener("ksic:account-changed", refresh);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter your name and a valid email.");
      return;
    }
    signIn(name, email);
    const intent = takeIntent();
    if (intent) {
      applyIntent(intent);
      window.location.assign(intent.next);
      return;
    }
    refresh();
  };

  if (!ready) {
    return (
      <main className="acct">
        <p className="acct__wait">Opening your profile…</p>
      </main>
    );
  }

  if (!account) {
    return (
      <main className="acct">
        <div className="acct__inner">
          <p className="acct__kicker">Account</p>
          <h1>Sign in</h1>
          <p className="acct__lead">Enter your name and email. These details stay with your profile on this device.</p>
          <form className="acct__form" onSubmit={submit}>
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
            </label>
            <label>
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" />
            </label>
            {error ? <p role="alert">{error}</p> : null}
            <button type="submit" className="acct__continue">
              Continue
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="acct">
      <div className="acct__inner">
        <header>
          <p className="acct__kicker">Account</p>
          <h1>{account.name}</h1>
          <p className="acct__lead">
            Signed in on this device. Your profile keeps the name and email you entered.
          </p>
          <div className="acct__actions">
            <Link href="/vault" className="acct__vault">
              Open Silk Vault <span aria-hidden="true">→</span>
            </Link>
            <button type="button" className="acct__out" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        </header>

        <div className="acct__grid">
          <section className="acct__panel" id="account" aria-label="Account details">
            <p className="acct__kicker">{initials(account.name)}</p>
            <h2>Your details</h2>
            <dl className="acct__details">
              <div>
                <dt>Name</dt>
                <dd>{account.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{account.email}</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>{account.since}</dd>
              </div>
            </dl>
          </section>

          <Link href="/vault" className="acct__vault-card">
            <p className="acct__kicker">Silk Vault</p>
            <h2>Where a saree lives after you buy it</h2>
            <p>Wishlist, saved creations, and — once an order can be completed — your wardrobe.</p>
            <span>Enter the vault →</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
