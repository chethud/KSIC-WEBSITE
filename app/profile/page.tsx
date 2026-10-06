import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Your Profile — Mysore Silk",
  description: "Manage your Mysore Silk account, orders, and saved saree designs.",
};

/** Demo-only account — no real auth. */
const demoUser = {
  name: "Ananya Rao",
  email: "ananya.rao@example.com",
  memberSince: "March 2024",
  phone: "+91 98765 43210",
};

const sections = [
  {
    title: "Orders",
    body: "Track handwoven pieces and atelier commissions as they leave Mysuru.",
    href: "#orders",
    action: "View orders",
  },
  {
    title: "Saved designs",
    body: "Return to sarees you composed in the atelier — colour, border, and zari intact.",
    href: "/your-saree",
    action: "Open atelier",
  },
  {
    title: "Addresses",
    body: "Keep delivery details ready for gifting and ceremonial orders.",
    href: "#addresses",
    action: "Manage addresses",
  },
];

const demoOrders = [
  {
    id: "KSIC-2841",
    title: "Peacock crepe — temple border",
    status: "Weaving",
    date: "12 Sep 2025",
    total: "₹48,500",
  },
  {
    id: "KSIC-2710",
    title: "Ivory pure silk — gold zari pallu",
    status: "Delivered",
    date: "3 Jun 2025",
    total: "₹62,000",
  },
];

const demoAddresses = [
  {
    label: "Home",
    lines: ["42, Vani Vilas Road", "Mysuru, Karnataka 570002", "India"],
  },
  {
    label: "Office",
    lines: ["KSIC Showroom Desk", "Sayyaji Rao Road", "Mysuru, Karnataka 570001"],
  },
];

export default function ProfilePage() {
  return (
    <>
      <Header variant="atelier" />
      <main className="profile">
        <section className="profile__hero">
          <div className="profile__hero-copy">
            <p className="profile__eyebrow">Mysore Silk · Account</p>
            <h1>
              Welcome, <span>{demoUser.name}</span>
            </h1>
            <p className="profile__lead">
              You are signed in. Follow orders, reopen atelier designs, and keep your silk
              wardrobe close.
            </p>
            <div className="profile__cta">
              <Link href="/your-saree" className="profile__btn profile__btn--gold">
                Continue designing
              </Link>
              <Link href="/vault" className="profile__btn profile__btn--line">
                My vault
              </Link>
              <button type="button" className="profile__btn profile__btn--quiet" disabled title="Demo only">
                Sign out
              </button>
            </div>
          </div>
          <aside className="profile__identity" aria-label="Signed-in member">
            <span className="profile__mark" aria-hidden="true">
              AR
            </span>
            <p className="profile__identity-kicker">Member since</p>
            <p className="profile__identity-name">{demoUser.memberSince}</p>
            <p className="profile__identity-mail">{demoUser.email}</p>
          </aside>
        </section>

        <section className="profile__grid" aria-label="Account areas">
          {sections.map((item, index) => (
            <article key={item.title} className="profile__block">
              <span className="profile__index">{String(index + 1).padStart(2, "0")}</span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              <Link href={item.href} className="profile__link">
                {item.action} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>

        <section className="profile__account" id="account" aria-label="Account details">
          <div className="profile__form-copy">
            <p className="profile__eyebrow">Account</p>
            <h2>Your details</h2>
            <p>
              Demo profile for walkthroughs. Replace with real authentication when the
              storefront goes live.
            </p>
          </div>
          <dl className="profile__details">
            <div>
              <dt>Name</dt>
              <dd>{demoUser.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{demoUser.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{demoUser.phone}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{demoUser.memberSince}</dd>
            </div>
          </dl>
        </section>

        <section className="profile__list" id="orders">
          <div className="profile__list-head">
            <p className="profile__eyebrow">Atelier</p>
            <h2>Orders</h2>
          </div>
          <ul className="profile__orders">
            {demoOrders.map((order) => (
              <li key={order.id} className="profile__order">
                <div>
                  <p className="profile__order-id">{order.id}</p>
                  <h3>{order.title}</h3>
                  <p className="profile__order-meta">
                    {order.date} · {order.total}
                  </p>
                </div>
                <span className="profile__status">{order.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="profile__list" id="addresses">
          <div className="profile__list-head">
            <p className="profile__eyebrow">Delivery</p>
            <h2>Addresses</h2>
          </div>
          <ul className="profile__addresses">
            {demoAddresses.map((addr) => (
              <li key={addr.label} className="profile__address">
                <p className="profile__address-label">{addr.label}</p>
                {addr.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
