export type NavLeaf = {
  label: string;
  href: string;
  image?: string;
  description?: string;
  ctaLabel?: string;
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
      {
        label: "The Story",
        href: "/story",
        image: "/story-silk.jpg",
        description: "How royal patronage and patient weaving shaped the house of Mysore silk.",
        ctaLabel: "Read the story",
      },
      {
        label: "The Craft",
        href: "/mysore-silk/craft",
        image: "/hands-weave.jpg",
        description: "Hands, looms and the slow discipline behind every border and butta.",
        ctaLabel: "Discover the craft",
      },
      {
        label: "The Silk",
        href: "/mysore-silk/silk",
        image: "/silk-threads.jpg",
        description: "Mulberry silk prized for its quiet lustre, weight and lasting drape.",
        ctaLabel: "About the silk",
      },
      {
        label: "The Zari",
        href: "/mysore-silk/zari",
        image: "/zari-macro.jpg",
        description: "Antique-gold zari that catches light without shouting — the mark of the house.",
        ctaLabel: "Explore the zari",
      },
      {
        label: "Authenticity",
        href: "/mysore-silk/authenticity",
        image: "/gold-thread.jpg",
        description: "How to recognise genuine KSIC Mysore silk and its marks of trust.",
        ctaLabel: "Verify authenticity",
      },
    ],
  },
  {
    id: "collections",
    label: "Collections",
    href: "/collections",
    children: [
      {
        label: "Sarees",
        href: "/sarees",
        image: "/cat-sarees.jpg",
        description: "Classic Mysore silk sarees for ceremony, celebration and everyday grace.",
        ctaLabel: "Browse sarees",
      },
      {
        label: "Crepe",
        href: "/collections/crepe",
        image: "/nav-thumb-crepe.jpg",
        description: "Soft crepe silk with a matte fall — light to wear, refined to the touch.",
        ctaLabel: "View crepe",
      },
      {
        label: "Printed",
        href: "/collections/printed",
        image: "/nav-thumb-printed.jpg",
        description: "Printed motifs on silk for a quieter, contemporary expression of tradition.",
        ctaLabel: "View printed",
      },
      {
        label: "Digital",
        href: "/collections/digital",
        image: "/nav-thumb-digital.jpg",
        description: "Digitally printed silk with modern pattern and precise colour.",
        ctaLabel: "View digital",
      },
      {
        label: "Men's",
        href: "/collections/mens",
        image: "/cat-mens.jpg",
        description: "Kurtas and silk for men — soft zari, clean lines, heritage cut.",
        ctaLabel: "Shop men's",
      },
      {
        label: "Gifts",
        href: "/collections/gifts",
        image: "/nav-thumb-gifts.jpg",
        description: "Curated silk gifts meant to be kept, worn and passed on.",
        ctaLabel: "Shop gifts",
      },
    ],
  },
  {
    id: "world",
    label: "The World of KSIC",
    href: "/heritage",
    children: [
      {
        label: "Our Heritage",
        href: "/heritage",
        image: "/generations.jpg",
        description: "A living lineage of weavers, patrons and silk that spans generations.",
        ctaLabel: "Explore heritage",
      },
      {
        label: "The Factory",
        href: "/world/factory",
        image: "/loom-craft.jpg",
        description: "Inside the looms where Mysore silk is still woven with care.",
        ctaLabel: "Visit the factory",
      },
      {
        label: "Our People",
        href: "/world/people",
        image: "/hands-weave.jpg",
        description: "The artisans whose hands give each saree its quiet character.",
        ctaLabel: "Meet our people",
      },
      {
        label: "The Archive",
        href: "/world/archive",
        image: "/heirloom.jpg",
        description: "Preserved weaves, borders and patterns from the house collection.",
        ctaLabel: "Open the archive",
      },
      {
        label: "Mysuru",
        href: "/world/mysuru",
        image: "/nav-thumb-mysuru.jpg",
        description: "The city of palaces and silk — where the house found its home.",
        ctaLabel: "Discover Mysuru",
      },
    ],
  },
  {
    id: "journal",
    label: "Journal",
    href: "/journal",
    children: [
      {
        label: "Stories",
        href: "/journal/stories",
        image: "/generations.jpg",
        description: "Narratives of silk, family and the occasions that call for Mysore weave.",
        ctaLabel: "Read stories",
      },
      {
        label: "Craft",
        href: "/journal/craft",
        image: "/loom-craft.jpg",
        description: "Notes from the loom — technique, tradition and making.",
        ctaLabel: "Read craft",
      },
      {
        label: "Culture",
        href: "/journal/culture",
        image: "/heritage-palace.jpg",
        description: "Festivals, ritual and the cultural life around Mysore silk.",
        ctaLabel: "Read culture",
      },
      {
        label: "Styling",
        href: "/wear",
        image: "/indian-saree-1.jpg",
        description: "How to drape, pair and wear silk for modern and ceremonial moments.",
        ctaLabel: "How to wear",
      },
      {
        label: "Care",
        href: "/care",
        image: "/nav-thumb-care.jpg",
        description: "Gentle care so your silk keeps its sheen for years to come.",
        ctaLabel: "Silk care",
      },
    ],
  },
  {
    id: "visit",
    label: "Visit",
    href: "/visit/showrooms",
    children: [
      {
        label: "Showrooms",
        href: "/visit/showrooms",
        image: "/nav-thumb-showroom.jpg",
        description: "Step into our showrooms and feel the silk in person.",
        ctaLabel: "Find showrooms",
      },
      {
        label: "Factory",
        href: "/visit/factory",
        image: "/loom-craft.jpg",
        description: "Arrange a visit to see weaving, zari and finishing up close.",
        ctaLabel: "Plan a visit",
      },
      {
        label: "Store Locator",
        href: "/visit/store-locator",
        image: "/nav-thumb-locator.jpg",
        description: "Locate the nearest KSIC house and plan your journey.",
        ctaLabel: "Locate a store",
      },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    href: "/sarees",
    children: [
      { label: "Sarees", href: "/sarees" },
      { label: "Dress Materials", href: "/shop/dress-materials" },
      { label: "Dupattas & Stoles", href: "/shop/dupattas" },
      { label: "Fabric by Meter", href: "/shop/fabric" },
      { label: "Gift Sets", href: "/shop/gift-sets" },
      { label: "New Arrivals", href: "/shop/new-arrivals" },
      { label: "Bestsellers", href: "/shop/bestsellers" },
      { label: "Wedding Collection", href: "/shop/wedding" },
      { label: "Festive Collection", href: "/shop/festive" },
      { label: "Exclusive Designs", href: "/shop/exclusive" },
      { label: "Build Your Saree", href: "/your-saree" },
    ],
  },
];

export type ShopCategory = NavLeaf & {
  image: string;
  description?: string;
  ctaLabel?: string;
};

export const SHOP_MEGA = {
  intro: {
    label: "Shop",
    title: "Timeless Mysore Silk",
    description: "Discover our handcrafted sarees, collections and exclusive designs.",
    ctaLabel: "View all",
    ctaHref: "/sarees",
    image: "/cat-sarees.jpg",
  },
  featured: [
    {
      label: "New Arrivals",
      href: "/shop/new-arrivals",
      image: "/collection-4.jpg",
      description: "Fresh from the loom — newly woven Mysore silk ready for the season ahead.",
      ctaLabel: "Explore arrivals",
    },
    {
      label: "Bestsellers",
      href: "/shop/bestsellers",
      image: "/heirloom.jpg",
      description: "The pieces our house is known for — beloved weaves chosen again and again.",
      ctaLabel: "Shop bestsellers",
    },
    {
      label: "Wedding Collection",
      href: "/shop/wedding",
      image: "/cat-bridal.jpg",
      description: "Ceremonial silk for bridal mornings, temple rites, and the evenings that follow.",
      ctaLabel: "View bridal silk",
    },
    {
      label: "Festive Collection",
      href: "/shop/festive",
      image: "/indian-saree-1.jpg",
      description: "Colour and zari for festivals, gatherings, and bright celebration nights.",
      ctaLabel: "Shop festive",
    },
    {
      label: "Exclusive Designs",
      href: "/shop/exclusive",
      image: "/cat-sarees.jpg",
      description: "Limited atelier pieces woven in small, careful runs for the discerning collector.",
      ctaLabel: "View exclusives",
    },
  ] satisfies ShopCategory[],
} as const;

export const GROUP_MEGA: Record<
  string,
  { label: string; title: string; description: string; ctaLabel: string; ctaHref: string }
> = {
  "mysore-silk": {
    label: "Mysore Silk",
    title: "The House of Silk",
    description: "Story, craft, zari and the mark of authenticity behind every weave.",
    ctaLabel: "Read the story",
    ctaHref: "/story",
  },
  collections: {
    label: "Collections",
    title: "Curated Weaves",
    description: "From bridal silk to everyday luxury — pieces for every occasion.",
    ctaLabel: "View collections",
    ctaHref: "/collections",
  },
  world: {
    label: "The World of KSIC",
    title: "Heritage & Place",
    description: "Factory floors, people, archives and the city that shaped the silk.",
    ctaLabel: "Explore heritage",
    ctaHref: "/heritage",
  },
  journal: {
    label: "Journal",
    title: "Stories & Style",
    description: "Craft notes, culture, how to wear, and how to care for silk.",
    ctaLabel: "Open journal",
    ctaHref: "/journal",
  },
  visit: {
    label: "Visit",
    title: "Come to Mysuru",
    description: "Showrooms, factory visits and a locator for the nearest house.",
    ctaLabel: "Find a showroom",
    ctaHref: "/visit/showrooms",
  },
};

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
