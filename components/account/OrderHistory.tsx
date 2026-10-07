"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readAccount, type Account } from "@/lib/account";
import { formatInr } from "@/lib/bag";

const sampleOrder = {
  id: "MS-1042",
  name: "The Royal Blue",
  detail: "Maharaja Collection",
  placed: "12 March 2026",
  status: "Completed",
  price: 128000,
  href: "/collection/royal-blue",
  image: "/maharaja/royal-blue.jpg?v=1",
};

export default function OrderHistory() {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAccount(readAccount());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <main className="acct">
        <p className="acct__wait">Opening your orders…</p>
      </main>
    );
  }

  return (
    <main className="acct">
      <div className="acct__inner">
        <p className="acct__kicker">Account</p>
        <h1>Order history</h1>
        {account ? (
          <>
            <p className="acct__lead">Orders kept with {account.name}.</p>
            <section className="acct__panel" aria-label="Orders">
              <article className="acct__order">
                <div className="acct__order-media">
                  <Image src={sampleOrder.image} alt="" fill sizes="96px" />
                </div>
                <div>
                  <p className="acct__kicker">
                    {sampleOrder.id} · {sampleOrder.status}
                  </p>
                  <h2>{sampleOrder.name}</h2>
                  <p className="acct__order-meta">
                    {sampleOrder.detail} · Placed {sampleOrder.placed}
                  </p>
                </div>
                <p className="acct__order-price">{formatInr(sampleOrder.price)}</p>
                <Link href={sampleOrder.href}>View saree</Link>
              </article>
            </section>
          </>
        ) : (
          <>
            <p className="acct__lead">Sign in to see orders kept with your profile.</p>
            <div className="acct__actions">
              <Link href="/account" className="acct__vault">
                Go to profile <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
