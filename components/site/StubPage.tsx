import Link from "next/link";
import Header from "@/components/Header";

type StubPageProps = {
  kicker: string;
  title: string;
  lead: string;
  ctaHref?: string;
  ctaLabel?: string;
  current?:
    | "home"
    | "mysore-silk"
    | "collections"
    | "world"
    | "journal"
    | "visit"
    | "shop"
    | "sarees"
    | "your-saree"
    | "heritage"
    | "story"
    | "experience";
};

export default function StubPage({
  kicker,
  title,
  lead,
  ctaHref = "/sarees",
  ctaLabel = "Discover the collection",
  current,
}: StubPageProps) {
  return (
    <>
      <Header variant="atelier" current={current} />
      <main className="ux">
        <div className="ux__inner">
          <p className="ux-kicker">{kicker}</p>
          <h1>{title}</h1>
          <p className="ux__lead">{lead}</p>
          <div className="ux-actions">
            <Link href={ctaHref} className="ux-btn ux-btn--gold">
              {ctaLabel}
            </Link>
            <Link href="/" className="ux-btn ux-btn--line">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
