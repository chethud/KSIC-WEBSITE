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
      <main className="orders">
        <p className="orders__wait">Opening your orders…</p>
      </main>
    );
  }

  return (
    <main className="orders">
      <div className="orders__inner">
        <header className="orders__hero">
          <p className="orders__kicker">Order history</p>
          <h1>{account ? "Your orders" : "Sign in to see orders"}</h1>
          <p className="orders__lead">
            {account
              ? `Kept with ${account.name}.`
              : "Orders stay with the account on this device."}
          </p>
        </header>

        {!account ? (
          <Link href="/account" className="orders__btn">
            Go to profile
          </Link>
        ) : orders.length === 0 ? (
          <section className="orders__empty">
            <p>No orders yet.</p>
            <Link href="/bag" className="orders__btn">
              Open your bag
            </Link>
          </section>
        ) : (
          <div className="orders__list">
            {orders.map((order) => (
              <article key={order.id} className="orders__card">
                <header className="orders__meta">
                  <div>
                    <p className="orders__kicker">{order.id}</p>
                    <h2>Placed {order.placed}</h2>
                  </div>
                  <span className="orders__status">{order.status}</span>
                  <p className="orders__total">{formatInr(order.total)}</p>
                </header>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      <Link href={item.href} className="orders__media">
                        {item.image ? <Image src={item.image} alt="" fill sizes="120px" /> : null}
                      </Link>
                      <div className="orders__copy">
                        <h3>
                          <Link href={item.href}>{item.name}</Link>
                        </h3>
                        {item.detail ? <p>{item.detail}</p> : null}
                        <p>Qty {item.qty}</p>
                      </div>
                      <p className="orders__price">{formatInr(item.price * item.qty)}</p>
                      <Link href={item.href} className="orders__view">
                        View saree
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
