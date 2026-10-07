"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readAccount } from "@/lib/account";
import { beginIntent } from "@/lib/intent";
import { readWishlist, removeWish, type WishItem } from "@/lib/wishlist";
import { formatInr } from "@/lib/bag";

export default function WishlistView() {
  const [items, setItems] = useState<WishItem[]>([]);
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const sync = () => {
    setSignedIn(Boolean(readAccount()));
    setItems(readWishlist());
    setReady(true);
  };

  useEffect(() => {
    sync();
    window.addEventListener("ksic:wishlist-changed", sync);
    window.addEventListener("ksic:account-changed", sync);
    return () => {
      window.removeEventListener("ksic:wishlist-changed", sync);
      window.removeEventListener("ksic:account-changed", sync);
    };
  }, []);

  if (!ready) return <p className="ux-empty">Opening your wishlist…</p>;

  return (
    <div className="ux__inner">
      <p className="ux-kicker">Wishlist</p>
      <h1>{items.length === 0 ? "Nothing saved yet" : "Sarees you are considering"}</h1>
      <p className="ux__lead">Wishlist is interest, not ownership. Purchased silks stay in My Wardrobe.</p>
      {!signedIn ? (
        <p className="ux-empty">Sign in to see sarees you save. <Link href="/account">Open account</Link></p>
      ) : items.length === 0 ? (
        <Link href="/sarees" className="ux-btn ux-btn--gold">Browse sarees</Link>
      ) : (
        <ul className="ux-list">
          {items.map((item) => (
            <li key={item.id} className="ux-row">
              <Link href={item.href}>
                {item.image ? <Image src={item.image} alt="" width={72} height={90} /> : <span />}
              </Link>
              <div>
                <p className="ux-kicker">{item.code}</p>
                <h2><Link href={item.href}>{item.name}</Link></h2>
                <p>{formatInr(item.price)} · In the collection</p>
                <div className="ux-actions">
                  <Link href={`/your-saree?silk=${item.id}`}>Try in 3D</Link>
                  <button
                    type="button"
                    onClick={() => {
                      const ran = beginIntent({
                        type: "add-bag",
                        next: "/bag",
                        item: {
                          id: item.id,
                          name: item.name,
                          detail: item.code,
                          href: item.href,
                          image: item.image,
                          price: item.price,
                        },
                      });
                      if (ran) window.location.assign("/bag");
                    }}
                  >
                    Add to bag
                  </button>
                  <button type="button" onClick={() => setItems(removeWish(item.id))}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
