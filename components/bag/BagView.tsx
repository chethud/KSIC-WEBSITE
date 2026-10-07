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

export default function BagView() {
  const [items, setItems] = useState<BagItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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

  return (
    <main className="bag">
      <section className="bag__hero">
        <p className="bag__eyebrow">Mysore Silk · Bag</p>
        <h1>{units === 0 ? "Your bag is empty" : "Your bag"}</h1>
        <p className="bag__lead">
          {units === 0
            ? "Sarees you add from the collection, or compose in the atelier, will wait here."
            : `${units} ${units === 1 ? "piece" : "pieces"} selected for weaving and delivery.`}
        </p>
      </section>

      {!ready ? null : items.length === 0 ? (
        <section className="bag__empty">
          <Link href="/sarees" className="bag__btn bag__btn--gold">
            Browse sarees
          </Link>
          <Link href="/your-saree" className="bag__btn bag__btn--line">
            Build your saree
          </Link>
        </section>
      ) : (
        <section className="bag__layout">
          <ul className="bag__list">
            {items.map((item) => (
              <li key={item.id} className="bag__item">
                <Link href={item.href} className="bag__media">
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="120px" />
                  ) : null}
                </Link>
                <div className="bag__copy">
                  <Link href={item.href}>
                    <h2>{item.name}</h2>
                  </Link>
                  {item.detail ? <p>{item.detail}</p> : null}
                  <p className="bag__line">{formatInr(item.price)}</p>
                  <div className="bag__row">
                    <div className="bag__qty" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" onClick={() => setItems(setBagQty(item.id, item.qty - 1))} aria-label="Decrease quantity">
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => setItems(setBagQty(item.id, item.qty + 1))} aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                    <button type="button" className="bag__remove" onClick={() => setItems(removeBagItem(item.id))}>
                      Remove
                    </button>
                  </div>
                </div>
                <p className="bag__sum">{formatInr(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>

          <aside className="bag__summary">
            <p className="bag__eyebrow">Summary</p>
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
            <p className="bag__total">
              <span>Total</span>
              <strong>{formatInr(total)}</strong>
            </p>
            <p className="bag__note">Inclusive of taxes. A demonstration bag until checkout opens.</p>
            <button
              type="button"
              className="bag__btn bag__btn--gold"
              onClick={() => setNotice("Checkout is not open yet. Your pieces stay saved in this bag.")}
            >
              Proceed to checkout
            </button>
            <Link href="/sarees" className="bag__btn bag__btn--line">
              Continue browsing
            </Link>
            {notice ? (
              <p className="bag__notice" role="status">
                {notice}
              </p>
            ) : null}
          </aside>
        </section>
      )}
    </main>
  );
}
