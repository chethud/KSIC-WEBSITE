"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readAccount, type Account } from "@/lib/account";
import { readAddresses, type Address } from "@/lib/addresses";
import { bagTotal, bagUnits, formatInr, readBag, removeBagItem, type BagItem } from "@/lib/bag";

const STEPS = [
  ["01", "Contact"],
  ["02", "Address"],
  ["03", "Delivery"],
  ["04", "Payment"],
] as const;

export default function CheckoutView() {
  const [account, setAccount] = useState<Account | null>(null);
  const [items, setItems] = useState<BagItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAccount(readAccount());
      setItems(readBag());
      const saved = readAddresses();
      setAddresses(saved);
      setAddressId((current) => current || saved[0]?.id || "");
      setReady(true);
    };
    sync();
    window.addEventListener("ksic:bag-changed", sync);
    window.addEventListener("ksic:account-changed", sync);
    return () => {
      window.removeEventListener("ksic:bag-changed", sync);
      window.removeEventListener("ksic:account-changed", sync);
    };
  }, []);

  if (!ready) {
    return (
      <div className="checkout__inner">
        <p className="checkout__kicker">Checkout</p>
        <h1>Preparing your review…</h1>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout__inner checkout__gate">
        <p className="checkout__kicker">Checkout</p>
        <h1>Your bag is empty</h1>
        <p className="checkout__lead">Add a saree before review. Nothing is held for delivery.</p>
        <Link href="/sarees" className="checkout__btn">View sarees</Link>
      </div>
    );
  }

  const address = addresses.find((item) => item.id === addressId);
  const units = bagUnits(items);

  return (
    <div className="checkout__inner">
      <p className="checkout__kicker">Checkout</p>
      <h1>Review your silk</h1>
      <p className="checkout__lead">
        Payment is not connected, so this review cannot place an order.
      </p>
      <ol className="checkout__steps">
        {STEPS.map(([index, label]) => (
          <li key={index}>
            {index}
            <strong>{label}</strong>
          </li>
        ))}
      </ol>

      <div className="checkout__layout">
        <div>
          <section className="checkout__panel" aria-labelledby="checkout-contact">
            <p className="checkout__kicker">01</p>
            <h2 id="checkout-contact">Contact</h2>
            {account ? (
              <>
                <p className="checkout__address">{account.name}</p>
                <p className="checkout__mail">{account.email}</p>
              </>
            ) : (
              <>
                <p className="checkout__address">Guest</p>
                <p className="checkout__mail">Sign-in is not required for this preview.</p>
              </>
            )}
          </section>

          <section className="checkout__panel" aria-labelledby="checkout-address">
            <p className="checkout__kicker">02</p>
            <h2 id="checkout-address">Address</h2>
            {addresses.length === 0 ? (
              <p>
                No saved address.
              </p>
            ) : (
              <label>
                Delivery address
                <select value={addressId} onChange={(event) => setAddressId(event.target.value)}>
                  {addresses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} — {item.city}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {address ? (
              <p className="checkout__address">
                {address.name}
                <br />
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {address.city}, {address.state} {address.pin}
                <br />
                {address.country}
              </p>
            ) : null}
          </section>

          <section className="checkout__panel" aria-labelledby="checkout-delivery">
            <p className="checkout__kicker">03</p>
            <h2 id="checkout-delivery">Delivery</h2>
            <p>A shipping method is not connected. PIN serviceability is not checked, and no delivery date is promised.</p>
          </section>

          <section className="checkout__panel" aria-labelledby="checkout-payment" role="status">
            <p className="checkout__kicker">04</p>
            <h2 id="checkout-payment">Payment unavailable</h2>
            <p>No UPI, card, net banking, or wallet is configured. An order will not be created, and this bag will not be cleared.</p>
          </section>
        </div>

        <aside className="checkout__summary" aria-label="Order summary">
          <p className="checkout__kicker">Your silk · {units}</p>
          <h2>{units === 1 ? "One piece" : `${units} pieces`}</h2>
          <ul className="checkout__lines">
            {items.map((item) => (
              <li key={item.id} className="checkout__line">
                <figure>
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="72px" />
                  ) : null}
                </figure>
                <div>
                  <h3><Link href={item.href}>{item.name}</Link></h3>
                  {item.detail ? <p>{item.detail}</p> : null}
                  <p>Qty {item.qty} · {formatInr(item.price * item.qty)}</p>
                  <button type="button" className="checkout__remove" onClick={() => removeBagItem(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="checkout__total">
            <span>Total</span>
            <strong>{formatInr(bagTotal(items))}</strong>
          </p>
          <p className="checkout__hold">Taxes and shipping are not calculated until checkout can take payment.</p>
          <button type="button" className="checkout__btn" disabled>
            Place order
          </button>
          <Link href="/bag" className="checkout__back">Return to bag</Link>
        </aside>
      </div>
    </div>
  );
}
