/**
 * Static product catalogue — used as a fallback when DATABASE_URL is not set
 * (e.g. Netlify Functions without an external database).
 *
 * Keep this in sync with scripts/netlify-db-setup.sql.
 * IDs match the serial order the DB assigns on first seed (1-based, insertion order).
 */

export interface FormattedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  category: string;
  inStock: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  isBestSelling: boolean;
  badge: string | null;
}

export interface FormattedCategory {
  id: number;
  name: string;
  slug: string;
}

export const STATIC_CATEGORIES: FormattedCategory[] = [
  { id: 1, name: "Hoodies",  slug: "hoodies" },
  { id: 2, name: "T-Shirts", slug: "tshirts" },
  { id: 3, name: "Jackets",  slug: "jackets" },
  { id: 4, name: "Pants",    slug: "pants"   },
];

export const STATIC_PRODUCTS: FormattedProduct[] = [
  {
    id: 1,
    name: "Classic Pullover Hoodie",
    description: "Premium heavyweight cotton hoodie with a relaxed fit. Built for comfort and street credibility.",
    price: 59.99,
    originalPrice: null,
    image: "https://talentless.co/cdn/shop/files/Mens_HeavyweightHoodie_Back_White.jpg?v=1705053408&width=1200",
    category: "Hoodies",
    inStock: true,
    isFeatured: true,
    isOnSale: false,
    isBestSelling: true,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Zip-Up Varsity Hoodie",
    description: "Varsity-style zip-up hoodie with ribbed cuffs and hem. Bold and athletic.",
    price: 74.99,
    originalPrice: 89.99,
    image: "https://hoodrichuk.com/cdn/shop/files/Hoodrich12022623291_3417a3ea-f2f7-4082-9110-816c7b8b4643.jpg?v=1774453976&width=1800",
    category: "Hoodies",
    inStock: true,
    isFeatured: false,
    isOnSale: true,
    isBestSelling: false,
    badge: "Sale",
  },
  {
    id: 3,
    name: "Oversized Graphic Tee",
    description: "Premium oversized tee with bold street graphics. 100% organic cotton.",
    price: 34.99,
    originalPrice: null,
    image: "https://www.rockstaroriginal.com/cdn/shop/files/01_d1f1389b-5f62-450e-ac56-4a31dc522251.jpg?v=1777591161&width=1480",
    category: "T-Shirts",
    inStock: true,
    isFeatured: true,
    isOnSale: false,
    isBestSelling: true,
    badge: "New",
  },
  {
    id: 4,
    name: "Essential Slim Fit Tee",
    description: "Clean, minimal slim-fit tee. Perfect base layer for any outfit.",
    price: 24.99,
    originalPrice: null,
    image: "https://reigningchamp.com/cdn/shop/files/SS26_RC-1577_WHITE_T-SHIRT_off_jp.jpg?v=1771972826",
    category: "T-Shirts",
    inStock: true,
    isFeatured: false,
    isOnSale: false,
    isBestSelling: false,
    badge: null,
  },
  {
    id: 5,
    name: "Striped Polo Tee",
    description: "Modern striped polo with a structured collar. Smart-casual essential.",
    price: 39.99,
    originalPrice: 49.99,
    image: "https://rowingblazers.com/cdn/shop/files/needs-tag_RB0-5MAY25_POLO_STRIPE_FRONTcopy.jpg?v=1774313809",
    category: "T-Shirts",
    inStock: true,
    isFeatured: false,
    isOnSale: true,
    isBestSelling: false,
    badge: "Sale",
  },
  {
    id: 6,
    name: "Urban Bomber Jacket",
    description: "Sleek bomber jacket with satin lining and ribbed details. A streetwear cornerstone.",
    price: 119.99,
    originalPrice: null,
    image: "https://www.stussy.com/cdn/shop/files/115903_WHIT_1_fc3640d0-b301-49af-a88c-6689d74564bb.jpg?v=1773267104&width=1920",
    category: "Jackets",
    inStock: true,
    isFeatured: true,
    isOnSale: false,
    isBestSelling: false,
    badge: "New",
  },
  {
    id: 7,
    name: "Cargo Utility Jacket",
    description: "Multi-pocket cargo jacket for the style-conscious. Heavy-duty fabric.",
    price: 99.99,
    originalPrice: 129.99,
    image: "https://www.karllagerfeld.com/cdn/shop/files/B3M14022100_1.jpg?v=1783146066",
    category: "Jackets",
    inStock: true,
    isFeatured: false,
    isOnSale: true,
    isBestSelling: false,
    badge: "Sale",
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    description: "Tailored slim-fit chinos that go from desk to street effortlessly.",
    price: 54.99,
    originalPrice: null,
    image: "/products/slim-fit-chinos.png",
    category: "Pants",
    inStock: true,
    isFeatured: false,
    isOnSale: false,
    isBestSelling: true,
    badge: null,
  },
  {
    id: 9,
    name: "Jogger Sweatpants",
    description: "Cozy tapered joggers with elastic waistband. Built for the active lifestyle.",
    price: 44.99,
    originalPrice: null,
    image: "https://zanerobe.com/cdn/shop/products/ZANEROBE-Orgo-Sureshot-Jogger-White-Noise-0.jpg?v=1690516848&width=2048",
    category: "Pants",
    inStock: true,
    isFeatured: true,
    isOnSale: false,
    isBestSelling: false,
    badge: "New",
  },
  {
    id: 10,
    name: "Wide-Leg Track Pants",
    description: "Relaxed wide-leg track pants with side stripes. Statement streetwear.",
    price: 49.99,
    originalPrice: 64.99,
    image: "https://pangaia.com/cdn/shop/files/365_MIDWEIGHT_TRACK_PANTS_OFF_WHITE_MENS_LEAD.jpg?crop=center&height=2132&v=1755183928&width=1600",
    category: "Pants",
    inStock: true,
    isFeatured: false,
    isOnSale: true,
    isBestSelling: false,
    badge: "Sale",
  },
  {
    id: 11,
    name: "Denim Street Jacket",
    description: "Classic denim jacket with a modern streetwear cut. Versatile layering piece built to last.",
    price: 89.99,
    originalPrice: null,
    image: "https://www.percivalclo.com/cdn/shop/files/WesternTruckerJacketDenimRaw_01.jpg?v=1768842352&width=1200",
    category: "Jackets",
    inStock: true,
    isFeatured: true,
    isOnSale: false,
    isBestSelling: false,
    badge: "New",
  },
  {
    id: 12,
    name: "Cargo Shorts",
    description: "Relaxed-fit cargo shorts with multiple utility pockets. The ultimate summer streetwear staple.",
    price: 44.99,
    originalPrice: 54.99,
    image: "https://mnml.la/cdn/shop/files/Distressed-Baggy-Cargo-Shorts-Off-White-3_1024x1024.jpg?v=1779268781",
    category: "Pants",
    inStock: true,
    isFeatured: false,
    isOnSale: true,
    isBestSelling: false,
    badge: "Sale",
  },
];

/** Map<id, FormattedProduct> for O(1) lookup by cart/wishlist routes. */
export function getStaticProductMap(): Map<number, FormattedProduct> {
  return new Map(STATIC_PRODUCTS.map((p) => [p.id, p]));
}

export interface ProductFilters {
  category?: string;
  featured?: boolean;
  onSale?: boolean;
  bestSelling?: boolean;
  search?: string;
}

/** Apply the same filters the DB query would apply, entirely in-memory. */
export function filterStaticProducts(filters: ProductFilters): FormattedProduct[] {
  return STATIC_PRODUCTS.filter((p) => {
    if (filters.category && p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
    if (filters.featured === true && !p.isFeatured) return false;
    if (filters.onSale === true && !p.isOnSale) return false;
    if (filters.bestSelling === true && !p.isBestSelling) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}
