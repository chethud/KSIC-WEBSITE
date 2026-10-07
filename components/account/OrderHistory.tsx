"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readAccount, type Account } from "@/lib/account";
import { formatInr, type BagItem } from "@/lib/bag";
import { readOrders, type PlacedOrder } from "@/lib/orders";

type Filter = "all" | "progress" | "delivered";

function orderYear(placed: string) {
  const match = placed.match(/\d{4}/);
  return match ? match[0] : "";
}

function shortDate(placed: string) {
  const parsed = Date.parse(placed);
  if (Number.isNaN(parsed)) return placed;
  return new Date(parsed).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusKind(status: string) {
  const value = status.toLowerCase();
  if (value.includes("deliver")) return "delivered";
  if (value.includes("progress")) return "progress";
  return "placed";
}

function silkDot(item: BagItem) {
  const text = `${item.name} ${item.detail}`.toLowerCase();
  if (text.includes("blue")) return "#1e4f86";
  if (text.includes("white") || text.includes("ivory")) return "#f4efe4";
  if (text.includes("maroon") || text.includes("vermilion") || text.includes("red")) return "#7a1c2b";
  if (text.includes("emerald") || text.includes("green")) return "#1d6a45";
  if (text.includes("pink") || text.includes("rose")) return "#d15b86";
  if (text.includes("gold")) return "#c4a15a";
  return "#c4a15a";
}

function units(order: PlacedOrder) {
  return order.items.reduce((sum, item) => sum + item.qty, 0);
}

export default function OrderHistory() {
  const [account, setAccount] = useState<Account | null>(null);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const accountNow = readAccount();
    const next = accountNow ? readOrders(accountNow.email) : [];
    setAccount(accountNow);
    setOrders(next);
    const latest = next.map((order) => orderYear(order.placed)).filter(Boolean).sort((a, b) => Number(b) - Number(a))[0];
    if (latest) setYear(latest);
    setReady(true);
  }, []);

  const years = useMemo(() => {
    const found = new Set(orders.map((order) => orderYear(order.placed)).filter(Boolean));
    return [...found].sort((a, b) => Number(b) - Number(a));
  }, [orders]);

  const inYear = useMemo(
    () => orders.filter((order) => year === "all" || orderYear(order.placed) === year),
    [orders, year],
  );

  const counts = useMemo(
    () => ({
      all: inYear.length,
      progress: inYear.filter((order) => statusKind(order.status) === "progress").length,
      delivered: inYear.filter((order) => statusKind(order.status) === "delivered").length,
    }),
    [inYear],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inYear.filter((order) => {
      const kind = statusKind(order.status);
      if (filter === "progress" && kind !== "progress") return false;
      if (filter === "delivered" && kind !== "delivered") return false;
      if (!q) return true;
      const names = order.items.map((item) => `${item.name} ${item.detail}`).join(" ");
      return `${order.id} ${names}`.toLowerCase().includes(q);
    });
  }, [filter, inYear, query]);

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
          <div>
            <p className="orders__kicker">Order history</p>
            <h1>{account ? "Your orders" : "Sign in to see orders"}</h1>
            <p className="orders__lead">
              {account ? "Your Mysore Silk journey." : "Orders stay with the account on this device."}
            </p>
          </div>
          {account && orders.length > 0 ? (
            <div className="orders__tools">
              <label className="orders__search">
                <span className="sr-only">Search by order number or saree name</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M16 16.5 20 20.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <input
                  type="search"
                  value={query}
                  placeholder="Search by order number or saree name"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label className="orders__year">
                <span className="sr-only">Year</span>
                <select value={year} onChange={(event) => setYear(event.target.value)}>
                  <option value="all">All years</option>
                  {years.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
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
          <>
            <div className="orders__tabs" role="tablist" aria-label="Filter orders">
              {(
                [
                  ["all", `All orders (${counts.all})`],
                  ["progress", `In progress (${counts.progress})`],
                  ["delivered", `Delivered (${counts.delivered})`],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={filter === id}
                  className={filter === id ? "is-selected" : ""}
                  onClick={() => setFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="orders__table">
              <div className="orders__head" aria-hidden="true">
                <span>Order</span>
                <span>Product</span>
                <span>Quantity</span>
                <span>Status</span>
                <span>Total</span>
                <span />
              </div>
              {visible.length === 0 ? (
                <p className="orders__none">No orders match this view.</p>
              ) : (
                <ul>
                  {visible.map((order) => {
                    const lead = order.items[0];
                    const kind = statusKind(order.status);
                    const extra = order.items.length - 1;
                    return (
                      <li key={order.id}>
                        <div className="orders__id">
                          <strong>{order.id}</strong>
                          <span>{shortDate(order.placed)}</span>
                        </div>
                        <div className="orders__product">
                          <Link href={lead?.href || "/sarees"} className="orders__media">
                            {lead?.image ? <Image src={lead.image} alt="" fill sizes="72px" /> : null}
                          </Link>
                          <div>
                            <h2>
                              <Link href={lead?.href || "/sarees"}>{lead?.name || "Mysore silk"}</Link>
                            </h2>
                            {lead?.detail ? <p>{lead.detail}</p> : null}
                            {extra > 0 ? <p>{extra === 1 ? "and 1 more saree" : `and ${extra} more sarees`}</p> : null}
                            <i style={{ background: lead ? silkDot(lead) : "#c4a15a" }} />
                          </div>
                        </div>
                        <p className="orders__qty">{units(order)}</p>
                        <p className={`orders__status is-${kind}`}>
                          <i />
                          {order.status}
                        </p>
                        <p className="orders__total">{formatInr(order.total)}</p>
                        <Link href={lead?.href || "/sarees"} className="orders__view">
                          View order <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
