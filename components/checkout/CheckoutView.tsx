"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readAccount, type Account } from "@/lib/account";
import { readAddresses, type Address } from "@/lib/addresses";
import { bagTotal, bagUnits, formatInr, readBag, removeBagItem, type BagItem } from "@/lib/bag";
import { beginIntent } from "@/lib/intent";

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
        <Link href="/sarees" className="checkout__checkout">View sarees</Link>
      </div>
    );
  }

  const address = addresses.find((item) => item.id === addressId);
  const units = bagUnits(items);

  return (
    <div className="checkout__inner">
      <div className="checkout__layout">
        <div className="checkout__main">
          <header className="checkout__hero">
            <p className="checkout__kicker">Checkout</p>
            <h1>Review your silk</h1>
            <p className="checkout__lead">
              Sign in to place the order. It is kept with your account on this device.
            </p>
          </header>

          <ol className="checkout__steps">
            {STEPS.map(([index, label]) => (
              <li key={index}>
                <span>{index}</span>
                {label}
              </li>
            ))}
          </ol>

          <section className="checkout__panel" aria-labelledby="checkout-contact">
            <p className="checkout__kicker">01 · Contact</p>
            <h2 id="checkout-contact">{account ? account.name : "No account on this device"}</h2>
            {account ? (
              <p className="checkout__mail">{account.email}</p>
            ) : (
              <>
                <p>Sign in to place this order with your name.</p>
                <button
                  type="button"
                  className="checkout__link"
                  onClick={() => window.dispatchEvent(new Event("ksic:auth-needed"))}
                >
                  Sign in
                </button>
              </>
            )}
          </section>

          <section className="checkout__panel" aria-labelledby="checkout-address">
            <p className="checkout__kicker">02 · Address</p>
            <h2 id="checkout-address">Delivery address</h2>
            {addresses.length === 0 ? (
              <p>No saved address.</p>
            ) : (
              <label>
                Saved addresses
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
            <p className="checkout__kicker">03 · Delivery</p>
            <h2 id="checkout-delivery">Shipping</h2>
            <p>A shipping method is not connected. PIN serviceability is not checked, and no delivery date is promised.</p>
          </section>

          <section className="checkout__panel" aria-labelledby="checkout-payment" role="status">
            <p className="checkout__kicker">04 · Payment</p>
            <h2 id="checkout-payment">No card is taken here</h2>
            <p>Place order records the sarees with your account. A payment gateway is not connected, so nothing is charged.</p>
          </section>
        </div>

        <aside className="checkout__summary" aria-label="Order summary">
          <h2>Order Summary</h2>
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
                  <p className="checkout__qty">Qty {item.qty} · {formatInr(item.price * item.qty)}</p>
                  <button type="button" className="checkout__remove" onClick={() => removeBagItem(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatInr(bagTotal(items))}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>Complimentary in India</dd>
            </div>
          </dl>
          <div className="checkout__total">
            <span>Total</span>
            <div>
              <strong>{formatInr(bagTotal(items))}</strong>
              <small>{units} {units === 1 ? "piece" : "pieces"}</small>
            </div>
          </div>
          <p className="checkout__hold">The total is the silk in your bag. Nothing is charged on this page.</p>
          <button
            type="button"
            className="checkout__checkout"
            onClick={() => {
              const ran = beginIntent({ type: "place-order", next: "/orders" });
              if (ran) window.location.assign("/orders");
            }}
          >
            Place order
          </button>
          <p className="checkout__or">or</p>
          <Link href="/bag" className="checkout__continue">Return to bag</Link>
        </aside>
      </div>
    </div>
  );
}
