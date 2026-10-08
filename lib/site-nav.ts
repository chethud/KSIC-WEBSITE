export type NavLeaf = {
  label: string;
  href: string;
};

export type NavGroup = {
  id: string;
  label: string;
  href?: string;
  children?: NavLeaf[];
};

export const SITE_NAV: NavGroup[] = [
  {
    id: "mysore-silk",
    label: "Mysore Silk",
    href: "/story",
    children: [
      { label: "The Story", href: "/story" },
      { label: "The Craft", href: "/mysore-silk/craft" },
      { label: "The Silk", href: "/mysore-silk/silk" },
      { label: "The Zari", href: "/mysore-silk/zari" },
      { label: "Authenticity", href: "/mysore-silk/authenticity" },
    ],
  },
  {
    id: "collections",
    label: "Collections",
    href: "/collections",
    children: [
      { label: "Sarees", href: "/sarees" },
      { label: "Crepe", href: "/collections/crepe" },
      { label: "Printed", href: "/collections/printed" },
      { label: "Digital", href: "/collections/digital" },
      { label: "Men's", href: "/collections/mens" },
      { label: "Gifts", href: "/collections/gifts" },
    ],
  },
  {
    id: "world",
    label: "The World of KSIC",
    href: "/heritage",
    children: [
      { label: "Our Heritage", href: "/heritage" },
      { label: "The Factory", href: "/world/factory" },
      { label: "Our People", href: "/world/people" },
      { label: "The Archive", href: "/world/archive" },
      { label: "Mysuru", href: "/world/mysuru" },
    ],
  },
  {
    id: "journal",
    label: "Journal",
    href: "/journal",
    children: [
      { label: "Stories", href: "/journal/stories" },
      { label: "Craft", href: "/journal/craft" },
      { label: "Culture", href: "/journal/culture" },
      { label: "Styling", href: "/wear" },
      { label: "Care", href: "/care" },
    ],
  },
  {
    id: "visit",
    label: "Visit",
    href: "/visit/showrooms",
    children: [
      { label: "Showrooms", href: "/visit/showrooms" },
      { label: "Factory", href: "/visit/factory" },
      { label: "Store Locator", href: "/visit/store-locator" },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    href: "/sarees",
    children: [
      { label: "New Arrivals", href: "/shop/new-arrivals" },
      { label: "Collections", href: "/collections" },
      { label: "Bestsellers", href: "/shop/bestsellers" },
      { label: "Build Your Saree", href: "/your-saree" },
    ],
  },
];

export type NavCurrent =
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

/** Map legacy Header `current` props and path prefixes onto top-level groups. */
export function navGroupActive(current?: NavCurrent | string, pathname?: string): string | undefined {
  if (current === "sarees" || current === "shop" || current === "your-saree" || current === "experience") {
    return "shop";
  }
  if (current === "collections") return "collections";
  if (current === "heritage" || current === "world") return "world";
  if (current === "story" || current === "mysore-silk") return "mysore-silk";
  if (current === "journal") return "journal";
  if (current === "visit") return "visit";
  if (current === "home") return "home";

  if (!pathname) return undefined;
  if (pathname === "/") return "home";
  if (pathname.startsWith("/mysore-silk") || pathname.startsWith("/story")) return "mysore-silk";
  if (pathname.startsWith("/collections") || pathname.startsWith("/collection/")) return "collections";
  if (pathname.startsWith("/world") || pathname.startsWith("/heritage")) return "world";
  if (
    pathname.startsWith("/journal") ||
    pathname.startsWith("/wear") ||
    pathname.startsWith("/care")
  ) {
    return "journal";
  }
  if (pathname.startsWith("/visit")) return "visit";
  if (
    pathname.startsWith("/sarees") ||
    pathname.startsWith("/shop") ||
    pathname.startsWith("/your-saree")
  ) {
    return "shop";
  }
  return undefined;
}
