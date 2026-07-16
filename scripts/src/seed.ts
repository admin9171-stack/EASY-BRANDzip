/**
 * Seed script — populates the database with sample products and categories.
 * Run with: pnpm --filter @workspace/scripts run seed
 */

import { db, categoriesTable, productsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding categories...");
  await db
    .insert(categoriesTable)
    .values([
      { name: "Hoodies", slug: "hoodies" },
      { name: "T-Shirts", slug: "tshirts" },
      { name: "Jackets", slug: "jackets" },
      { name: "Pants", slug: "pants" },
    ])
    .onConflictDoNothing();

  console.log("Seeding products...");
  await db
    .insert(productsTable)
    .values([
      {
        name: "Classic Pullover Hoodie",
        description:
          "Premium heavyweight cotton hoodie with a relaxed fit. Built for comfort and street credibility.",
        price: "59.99",
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
        category: "Hoodies",
        inStock: true,
        isFeatured: true,
        isOnSale: false,
        isBestSelling: true,
        badge: "Best Seller",
      },
      {
        name: "Zip-Up Varsity Hoodie",
        description:
          "Varsity-style zip-up hoodie with ribbed cuffs and hem. Bold and athletic.",
        price: "74.99",
        originalPrice: "89.99",
        image:
          "https://images.unsplash.com/photo-1578768079052-aa76e52ff3a8?w=600&q=80",
        category: "Hoodies",
        inStock: true,
        isFeatured: false,
        isOnSale: true,
        isBestSelling: false,
        badge: "Sale",
      },
      {
        name: "Oversized Graphic Tee",
        description:
          "Premium oversized tee with bold street graphics. 100% organic cotton.",
        price: "34.99",
        image:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
        category: "T-Shirts",
        inStock: true,
        isFeatured: true,
        isOnSale: false,
        isBestSelling: true,
        badge: "New",
      },
      {
        name: "Essential Slim Fit Tee",
        description:
          "Clean, minimal slim-fit tee. Perfect base layer for any outfit.",
        price: "24.99",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
        category: "T-Shirts",
        inStock: true,
        isFeatured: false,
        isOnSale: false,
        isBestSelling: false,
      },
      {
        name: "Striped Polo Tee",
        description:
          "Modern striped polo with a structured collar. Smart-casual essential.",
        price: "39.99",
        originalPrice: "49.99",
        image:
          "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80",
        category: "T-Shirts",
        inStock: true,
        isFeatured: false,
        isOnSale: true,
        isBestSelling: false,
        badge: "Sale",
      },
      {
        name: "Urban Bomber Jacket",
        description:
          "Sleek bomber jacket with satin lining and ribbed details. A streetwear cornerstone.",
        price: "119.99",
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
        category: "Jackets",
        inStock: true,
        isFeatured: true,
        isOnSale: false,
        isBestSelling: false,
        badge: "New",
      },
      {
        name: "Cargo Utility Jacket",
        description:
          "Multi-pocket cargo jacket for the style-conscious. Heavy-duty fabric.",
        price: "99.99",
        originalPrice: "129.99",
        image:
          "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80",
        category: "Jackets",
        inStock: true,
        isFeatured: false,
        isOnSale: true,
        isBestSelling: false,
        badge: "Sale",
      },
      {
        name: "Slim Fit Chinos",
        description:
          "Tailored slim-fit chinos that go from desk to street effortlessly.",
        price: "54.99",
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
        category: "Pants",
        inStock: true,
        isFeatured: false,
        isOnSale: false,
        isBestSelling: true,
      },
      {
        name: "Jogger Sweatpants",
        description:
          "Cozy tapered joggers with elastic waistband. Built for the active lifestyle.",
        price: "44.99",
        image:
          "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80",
        category: "Pants",
        inStock: true,
        isFeatured: true,
        isOnSale: false,
        isBestSelling: false,
        badge: "New",
      },
      {
        name: "Wide-Leg Track Pants",
        description:
          "Relaxed wide-leg track pants with side stripes. Statement streetwear.",
        price: "49.99",
        originalPrice: "64.99",
        image:
          "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80",
        category: "Pants",
        inStock: true,
        isFeatured: false,
        isOnSale: true,
        isBestSelling: false,
        badge: "Sale",
      },
    ])
    .onConflictDoNothing();

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
