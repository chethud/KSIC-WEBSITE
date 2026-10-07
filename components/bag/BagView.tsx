"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  bagTotal,
  bagUnits,
  formatInr,
  readBag,
  removeBagItem,
  setBagQty,
  type BagItem,
} from "@/lib/bag";
import { beginIntent } from "@/lib/intent";
import { addWish } from "@/lib/wishlist";

export default function BagView() {
  const [items, setItems] = useState<BagItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readBag());
    sync();
    setReady(true);
    window.addEventListener("ksic:bag-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ksic:bag-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const units = bagUnits(items);
  const total = bagTotal(items);

  const saveLater = (item: BagItem) => {
    addWish({
      id: item.id,
      name: item.name,
      href: item.href,
      image: item.image,
      price: item.price,
      code: item.id,
    });
    setItems(removeBagItem(item.id));
  };

  return (
    <main className="bag">
      {!ready ? null : items.length === 0 ? (
        <section className="bag__empty">
          <p className="bag__kicker">Shopping bag</p>
          <h1>Your bag is empty</h1>
          <p className="bag__lead">Sarees you add from the collection, or compose in the atelier, will wait here.</p>
          <div className="bag__empty-actions">
            <Link href="/sarees" className="bag__checkout">
              Browse sarees
            </Link>
            <Link href="/your-saree" className="bag__continue">
              Build your saree
            </Link>
          </div>
        </section>
      ) : (
        <div className="bag__layout">
          <section className="bag__main">
            <header className="bag__hero">
              <p className="bag__kicker">Shopping bag</p>
              <h1>Your bag</h1>
              <p className="bag__lead">
                {units} {units === 1 ? "piece" : "pieces"} selected for weaving and delivery.
              </p>
            </header>

            <ul className="bag__list">
              {items.map((item) => (
                <li key={item.id} className="bag__card">
                  <Link href={item.href} className="bag__media">
                    {item.image ? (
                      <Image src={item.image} alt="" fill sizes="220px" />
                    ) : null}
                  </Link>
                  <div className="bag__copy">
                    <Link href={item.href}>
                      <h2>{item.name}</h2>
                    </Link>
                    {item.detail ? <p>{item.detail}</p> : null}
                    <p className="bag__price">{formatInr(item.price)}</p>
                    <div className="bag__tools">
                      <div className="bag__qty" aria-label={`Quantity for ${item.name}`}>
                        <button
                          type="button"
                          onClick={() => setItems(setBagQty(item.id, item.qty - 1))}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setItems(setBagQty(item.id, item.qty + 1))}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button type="button" className="bag__ghost" onClick={() => saveLater(item)}>
                        <HeartIcon />
                        Save later
                      </button>
                      <span className="bag__rule" aria-hidden="true" />
                      <button type="button" className="bag__ghost" onClick={() => setItems(removeBagItem(item.id))}>
                        <TrashIcon />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="bag__summary">
            <h2>Order Summary</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{formatInr(total)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>Complimentary in India</dd>
              </div>
            </dl>
            <div className="bag__total">
              <span>Total</span>
              <div>
                <strong>{formatInr(total)}</strong>
                <small>Inclusive of all taxes</small>
              </div>
            </div>
            <button
              type="button"
              className="bag__checkout"
              onClick={() => {
                const ran = beginIntent({ type: "checkout", next: "/checkout" });
                if (ran) window.location.assign("/checkout");
              }}
            >
              Proceed to Checkout <span aria-hidden="true">→</span>
            </button>
            <p className="bag__or">or</p>
            <Link href="/sarees" className="bag__continue">
              Continue Shopping
            </Link>
            <p className="bag__fine">Sign-in is required. Payment is not taken from this bag.</p>
          </aside>
        </div>
      )}
    </main>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 19.2s-6.2-3.9-8.4-7.4C2.2 9.6 3.1 6.8 5.6 6.2c1.6-.4 3 .2 3.9 1.5.9-1.3 2.3-1.9 3.9-1.5 2.5.6 3.4 3.4 2 5.6-2.2 3.5-8.4 7.4-8.4 7.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7.5h14" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.2 7.4V5.8h5.6v1.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.2 7.5l.7 11h8.2l.7-11" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
