"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readAccount, type Account } from "@/lib/account";
import { formatInr } from "@/lib/bag";
import { readOrders, type PlacedOrder } from "@/lib/orders";

export default function OrderHistory() {
  const [account, setAccount] = useState<Account | null>(null);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const accountNow = readAccount();
    setAccount(accountNow);
    setOrders(accountNow ? readOrders(accountNow.email) : []);
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
            {orders.length === 0 ? (
              <p className="acct__lead">No orders yet. Place one from your bag.</p>
            ) : (
              <section className="acct__panel" aria-label="Orders">
                {orders.map((order) => {
                  const first = order.items[0];
                  const extra = order.items.length - 1;
                  return (
                    <article key={order.id} className="acct__order">
                      <div className="acct__order-media">
                        {first?.image ? <Image src={first.image} alt="" fill sizes="96px" /> : null}
                      </div>
                      <div>
                        <p className="acct__kicker">
                          {order.id} · {order.status}
                        </p>
                        <h2>{first?.name}</h2>
                        <p className="acct__order-meta">
                          {extra > 0 ? `and ${extra} more · ` : ""}
                          Placed {order.placed}
                        </p>
                      </div>
                      <p className="acct__order-price">{formatInr(order.total)}</p>
                      {first ? <Link href={first.href}>View saree</Link> : null}
                    </article>
                  );
                })}
              </section>
            )}
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
