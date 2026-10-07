import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import "./journal.css";

export const metadata: Metadata = {
  title: "The Journal — Mysore Silk",
  description: "Stories of craftsmanship, heritage, people, styling and the timeless art of Mysore Silk.",
};

const wearGuides = [
  { label: "Draping", image: "/journal/journal-draping.jpg" },
  { label: "Blouse", image: "/journal/journal-blouse.jpg" },
  { label: "Styling", image: "/journal/journal-styling.jpg" },
  { label: "Care", image: "/journal/journal-care.jpg" },
];

export default function JournalPage() {
  return (
    <>
      <Header variant="atelier" current="journal" />
      <main className="journal">
        <div className="journal__wrap">
          <header className="j-intro">
            <div>
              <p className="j-kicker">The Journal</p>
              <h1>
                Stories Woven
                <br />
                Into Silk
              </h1>
            </div>
            <p>
              Stories of craftsmanship, heritage, people, styling and the timeless art of Mysore Silk.
            </p>
          </header>

          <div className="j-row">
            <article className="j-card">
              <div className="j-card__copy">
                <p className="j-kicker">
                  <BookIcon /> Journal
                </p>
                <h2>
                  Read the
                  <br />
                  Loom&apos;s Story
                </h2>
                <p className="j-lead">
                  People, places and moments that made Mysore Silk a timeless heritage. From royal
                  history to artisans, materials and the stories behind each weave.
                </p>
                <p className="j-label">What you&apos;ll find</p>
                <ul className="j-topics">
                  <li>
                    <CrownIcon />
                    <span>Royal<br />History</span>
                  </li>
                  <li>
                    <LoomIcon />
                    <span>Artisan<br />Stories</span>
                  </li>
                  <li>
                    <ThreadIcon />
                    <span>Silk &amp; Zari<br />Origins</span>
                  </li>
                  <li>
                    <MarkIcon />
                    <span>Heritage<br />Features</span>
                  </li>
                </ul>
                <div className="j-cta">
                  <Link className="j-btn" href="/heritage">
                    Explore Stories <span aria-hidden="true">→</span>
                  </Link>
                  <p>Discover the people, craft and culture behind Mysore Silk.</p>
                </div>
              </div>
              <div className="j-card__media">
                <Image
                  src="/journal/journal-loom.jpg"
                  alt="An artisan weaving maroon Mysore silk with gold zari on a handloom"
                  fill
                  priority
                  sizes="(max-width: 980px) 100vw, 40vw"
                />
              </div>
            </article>

            <article className="j-card j-card--wear">
              <div className="j-card__copy">
                <p className="j-kicker">
                  <PinIcon /> How to Wear
                </p>
                <h2>
                  Learn the Art
                  <br />
                  of the Saree
                </h2>
                <p className="j-lead">
                  Step-by-step guides to draping, pleating, blouse pairing, occasion styling and
                  care — so you can wear your Mysore Silk with confidence and grace.
                </p>
                <p className="j-label">What you&apos;ll find</p>
                <ul className="j-topics">
                  <li>
                    <PlayIcon />
                    <span>Draping<br />Guides</span>
                  </li>
                  <li>
                    <BlouseIcon />
                    <span>Blouse<br />Pairing</span>
                  </li>
                  <li>
                    <StarIcon />
                    <span>Occasion<br />Styling</span>
                  </li>
                  <li>
                    <LeafIcon />
                    <span>Care<br />Tips</span>
                  </li>
                </ul>
                <div className="j-cta">
                  <Link className="j-btn" href="/wear">
                    Learn to Wear <span aria-hidden="true">→</span>
                  </Link>
                  <p>Beautiful guides to help you style, wear and care for your saree.</p>
                </div>
              </div>
              <div className="j-card__media">
                <Image
                  src="/journal/journal-wear.jpg"
                  alt="A woman in an ivory Mysore silk saree with a gold zari border"
                  fill
                  sizes="(max-width: 980px) 100vw, 28vw"
                />
              </div>
              <ul className="j-rail" aria-label="Styling guides">
                {wearGuides.map((guide) => (
                  <li key={guide.label}>
                    <span className="j-rail__pic">
                      <Image src={guide.image} alt="" fill sizes="80px" />
                    </span>
                    <span>{guide.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <article className="j-vault">
            <div className="j-vault__copy">
              <p className="j-kicker">
                <VaultIcon /> Silk Vault
              </p>
              <h2>Where Your Saree Lives</h2>
              <p className="j-lead">
                Your personal wardrobe for everything Mysore Silk. Save your favourite sarees,
                manage your designs and purchases, keep care records, and store certificates — all
                in one place.
              </p>
              <p className="j-label">What you can do</p>
              <ul className="j-feats">
                <li>
                  <HeartIcon />
                  <span>Wishlist</span>
                  <small>Save favourites</small>
                </li>
                <li>
                  <GridIcon />
                  <span>Saved Designs</span>
                  <small>Your creations</small>
                </li>
                <li>
                  <BagIcon />
                  <span>Your Purchases</span>
                  <small>Order history</small>
                </li>
                <li>
                  <CertIcon />
                  <span>Certificates</span>
                  <small>Authenticity &amp; GI</small>
                </li>
                <li>
                  <HangerIcon />
                  <span>Wardrobe</span>
                  <small>Manage &amp; plan</small>
                </li>
                <li>
                  <LeafIcon />
                  <span>Care Records</span>
                  <small>Keep it beautiful</small>
                </li>
              </ul>
              <div className="j-cta">
                <Link className="j-btn" href="/vault">
                  Open My Silk Vault <span aria-hidden="true">→</span>
                </Link>
                <p>Access your saved designs, purchases and personal saree collection.</p>
              </div>
            </div>
            <div className="j-vault__media">
              <Image
                src="/journal/journal-vault.jpg"
                alt="A rosewood chest of folded Mysore silk sarees"
                fill
                sizes="(max-width: 980px) 100vw, 60vw"
              />
              <p className="j-vault__line">
                <span>Preserve</span>
                <span>Plan</span>
                <span>Cherish</span>
                <em>For Generations</em>
              </p>
            </div>
          </article>

          <article className="j-split">
            <div className="j-split__copy">
              <p className="j-kicker">Craft &amp; Origin</p>
              <h2>
                The Art Behind
                <br />
                Every Thread
              </h2>
              <p className="j-lead">
                Before a saree is a garment, it is silk, silver and a hand that knows the count.
                Zari is drawn, the loom is dressed, and the border is set with patience.
              </p>
              <Link className="j-btn" href="/heritage?chapter=3">
                Read the craft <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="j-split__media">
              <Image src="/hands-weave.jpg" alt="Hands drawing gold zari across maroon silk" fill sizes="50vw" />
            </div>
          </article>

          <article className="j-split j-split--flip">
            <div className="j-split__media">
              <Image
                src="/heritage/05-wide.jpg?v=5"
                alt="Mysore silk worn beside palace architecture"
                fill
                sizes="55vw"
              />
            </div>
            <div className="j-split__copy">
              <p className="j-kicker">Heritage</p>
              <h2>
                A Legacy
                <br />
                Woven in Mysuru
              </h2>
              <p className="j-lead">
                In 1912 the Wadiyar court asked for a silk worthy of the palace. The loom in Mysuru
                still answers that commission, one saree at a time.
              </p>
              <Link className="j-btn" href="/heritage?chapter=1">
                Open the story <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>

          <article className="j-banner">
            <Image src="/heritage/07.jpg?v=3" alt="A woman draped in Mysore silk" fill sizes="100vw" />
            <div className="j-banner__copy">
              <p className="j-kicker">Style</p>
              <h2>
                How to Wear
                <br />
                Mysore Silk
              </h2>
              <p>A quieter drape, a temple border, an evening pallu. The same silk, dressed for the day.</p>
              <Link className="j-btn" href="/wear">
                See the guides <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>

          <div className="j-duo">
            <article className="j-note">
              <div className="j-note__media">
                <Image src="/pdp/ivory-silk.jpg" alt="Ivory silk with a gold temple border" fill sizes="40vw" />
              </div>
              <div className="j-note__copy">
                <p className="j-kicker">Care</p>
                <h2>
                  Keep Your Silk
                  <br />
                  Beautiful
                </h2>
                <p>Shade, muslin, and a fresh fold. The zari stays bright when the saree is allowed to rest.</p>
                <Link className="j-textlink" href="/care">
                  Silk care <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            <article className="j-portrait">
              <Image src="/heritage/06.jpg?v=3" alt="Portrait in Mysore silk" fill sizes="40vw" />
              <div className="j-portrait__copy">
                <p className="j-kicker">People</p>
                <h2>The Hands Behind the Weave</h2>
                <Link className="j-textlink" href="/story">
                  Meet the house <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 5.5h9.5A2.5 2.5 0 0 1 18 8v11H8.2A2.2 2.2 0 0 0 6 21.2V5.5z" />
      <path d="M6 5.5A2.2 2.2 0 0 1 8.2 3.3H18" />
    </svg>
  );
}
function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 16.5 6.2 8l3.3 3.2L12 6.5l2.5 4.7L17.8 8 20 16.5H4z" />
    </svg>
  );
}
function LoomIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19V6M9 19V6M13 19V6M17 19V6M19 19V6M4 8h16M4 16h16" />
    </svg>
  );
}
function ThreadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 16c4-8 6-8 10-2" />
      <path d="M8 8c2 3 4 3 8 0" />
    </svg>
  );
}
function MarkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.5 14 9h5l-4 3.2 1.5 5.3L12 14.8 7.5 17.5 9 12.2 5 9h5l2-4.5z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="1.6" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="6" width="14" height="12" rx="1.5" />
      <path d="M11 10.2v3.6L14.2 12 11 10.2z" />
    </svg>
  );
}
function BlouseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6.5 12 9l4-2.5 2 3-2.2 1.2V18H8.2V10.2L6 9l2-2.5z" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5.5 13.4 10h4.4l-3.5 2.6 1.3 4.4L12 14.6 8.4 17l1.3-4.4L6.2 10h4.4L12 5.5z" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 16c6-1 10-6 12-11-5 1-10 5-12 11z" />
      <path d="M9 14c1.2-1.4 2.6-2.6 4.2-3.4" />
    </svg>
  );
}
function VaultIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="6" width="16" height="13" rx="1.4" />
      <path d="M8 6V5.2A4 4 0 0 1 12 1.5 4 4 0 0 1 16 5.2V6" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 18.5s-6-3.6-6-7.4A3.2 3.2 0 0 1 12 8.6a3.2 3.2 0 0 1 6 2.5c0 3.8-6 7.4-6 7.4z" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 8h10l-.8 11H7.8L7 8z" />
      <path d="M9.5 8V7a2.5 2.5 0 0 1 5 0v1" />
    </svg>
  );
}
function CertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5h10v12l-5-2.4-5 2.4v-12z" />
      <path d="M9.5 9h5M9.5 11.5h3.5" />
    </svg>
  );
}
function HangerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 7.2a1.6 1.6 0 1 0-1.5-2.4" />
      <path d="M4.5 16.5 12 9.2l7.5 7.3" />
    </svg>
  );
}
