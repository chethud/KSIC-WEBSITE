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
            <Link href="/sarees">All sarees</Link>
            <Link href="/sarees?category=bridal">Bridal</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/sarees?category=pastel">Everyday luxury</Link>
          </div>
          <div>
            <p>Atelier</p>
            <Link href="/your-saree">Build your saree</Link>
            <Link href="/wear">How to wear</Link>
            <Link href="/care">Silk care</Link>
          </div>
          <div>
            <p>House</p>
            <Link href="/story">Our story</Link>
            <Link href="/heritage">Heritage</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/account">Silk Vault</Link>
          </div>
          <div>
            <p>Account</p>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/bag">Bag</Link>
            <Link href="/account?tab=orders">My orders</Link>
            <Link href="/account?tab=creations">Saved creations</Link>
          </div>
        </div>
      </div>
      <div className="footer-ed__bottom">
        <span>© Mysore Silk</span>
        <span>KSIC</span>
      </div>
    </footer>
  );
}