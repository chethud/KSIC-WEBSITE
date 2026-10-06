import Link from "next/link";
import Emblem from "../Emblem";

export default function Footer() {
  return (
    <footer className="footer-ed">
      <div className="footer-ed__top">
        <div className="footer-ed__brand">
          <Emblem />
          <p>Woven for Generations</p>
        </div>
        <div className="footer-ed__cols">
          <div>
            <p>Shop</p>
            <Link href="#collection">Sarees</Link>
            <Link href="#collection">New Arrivals</Link>
            <Link href="#collection">Collections</Link>
            <Link href="#categories">Bridal</Link>
            <Link href="#collection">Gifting</Link>
          </div>
          <div>
            <p>Discover</p>
            <Link href="#craft">Our Craft</Link>
            <Link href="/heritage">Heritage</Link>
            <Link href="#stories">Stories</Link>
            <Link href="#silk">The Silk</Link>
            <Link href="#craft">Zari</Link>
          </div>
          <div>
            <p>Services</p>
            <Link href="/your-saree">Personalize</Link>
            <Link href="#finale">Care Guide</Link>
            <Link href="#finale">Shipping</Link>
            <Link href="#finale">Returns</Link>
            <Link href="#finale">Contact</Link>
          </div>
          <div>
            <p>Connect</p>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </div>
      <div className="footer-ed__bottom">
        <span>© Mysore Silk</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Shipping</span>
      </div>
    </footer>
  );
}
