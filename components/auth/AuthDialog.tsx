"use client";

import { useEffect, useId, useState } from "react";
import { signIn } from "@/lib/account";
import { applyIntent, clearIntent, takeIntent } from "@/lib/intent";

export default function AuthDialog() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const openDialog = () => {
      setError("");
      setOpen(true);
    };
    window.addEventListener("ksic:auth-needed", openDialog);
    return () => window.removeEventListener("ksic:auth-needed", openDialog);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearIntent();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const close = () => {
    clearIntent();
    setOpen(false);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Enter the name for this account.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    signIn(name, email);
    const intent = takeIntent();
    setOpen(false);
    if (intent) {
      applyIntent(intent);
      window.location.assign(intent.next);
      return;
    }
    window.location.assign("/account");
  };

  return (
    <div className="auth" role="presentation">
      <button type="button" className="auth__shade" aria-label="Close sign in" onClick={close} />
      <div className="auth__panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <p className="ux-kicker">Mysore Silk</p>
        <h2 id={titleId}>Sign in to continue</h2>
        <p className="auth__lead">
          Browsing stays open. Your wishlist and saved saree need an account, and you will return to the same action.
        </p>
        <form onSubmit={submit}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </label>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
          </label>
          {error ? <p className="auth__error" role="alert">{error}</p> : null}
          <button type="submit" className="ux-btn ux-btn--gold">Continue</button>
        </form>
        <p className="auth__note">This account is kept on this device. A server sign-in is not connected yet.</p>
      </div>
    </div>
  );
}
