-- =============================================================================
-- Easy-Brand Store — Netlify Database Setup
-- =============================================================================
-- Run this once in your external PostgreSQL database (Neon, Supabase, Railway,
-- etc.) to create all tables and seed the product catalogue.
--
-- Steps:
--   1. Create a PostgreSQL database on Neon (neon.tech), Supabase, or Railway.
--   2. Copy the connection string and add it to Netlify:
--      Site settings → Environment variables → DATABASE_URL
--      Also add: SESSION_SECRET = <any long random string>
--   3. Open the SQL editor in your DB provider's dashboard.
--   4. Paste and run this entire file.
--   5. Trigger a new Netlify deploy (or redeploy the latest).
-- =============================================================================


-- ── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "categories" (
  "id"         serial PRIMARY KEY NOT NULL,
  "name"       text NOT NULL,
  "slug"       text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "products" (
  "id"             serial PRIMARY KEY NOT NULL,
  "name"           text NOT NULL,
  "description"    text DEFAULT '' NOT NULL,
  "price"          numeric(10, 2) NOT NULL,
  "original_price" numeric(10, 2),
  "image"          text NOT NULL,
  "category"       text NOT NULL,
  "in_stock"       boolean DEFAULT true NOT NULL,
  "is_featured"    boolean DEFAULT false NOT NULL,
  "is_on_sale"     boolean DEFAULT false NOT NULL,
  "is_best_selling" boolean DEFAULT false NOT NULL,
  "badge"          text,
  "created_at"     timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id"              serial PRIMARY KEY NOT NULL,
  "order_number"    integer NOT NULL,
  "email"           text NOT NULL,
  "total"           numeric(10, 2) NOT NULL,
  "payment_method"  text NOT NULL,
  "status"          text DEFAULT 'pending' NOT NULL,
  "note"            text,
  "billing_address" jsonb NOT NULL,
  "created_at"      timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);

CREATE TABLE IF NOT EXISTS "order_items" (
  "id"           serial PRIMARY KEY NOT NULL,
  "order_id"     integer NOT NULL REFERENCES "orders"("id"),
  "product_id"   integer NOT NULL,
  "product_name" text NOT NULL,
  "quantity"     integer NOT NULL,
  "price"        numeric(10, 2) NOT NULL,
  "line_total"   numeric(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id"         text PRIMARY KEY NOT NULL,
  "data"       jsonb NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);


-- ── Categories ───────────────────────────────────────────────────────────────

INSERT INTO "categories" ("name", "slug") VALUES
  ('Hoodies',  'hoodies'),
  ('T-Shirts', 'tshirts'),
  ('Jackets',  'jackets'),
  ('Pants',    'pants')
ON CONFLICT ("slug") DO NOTHING;


-- ── Products ─────────────────────────────────────────────────────────────────

INSERT INTO "products"
  ("name", "description", "price", "original_price", "image", "category",
   "in_stock", "is_featured", "is_on_sale", "is_best_selling", "badge")
VALUES
  (
    'Classic Pullover Hoodie',
    'Premium heavyweight cotton hoodie with a relaxed fit. Built for comfort and street credibility.',
    59.99, NULL,
    'https://talentless.co/cdn/shop/files/Mens_HeavyweightHoodie_Back_White.jpg?v=1705053408&width=1200',
    'Hoodies', true, true, false, true, 'Best Seller'
  ),
  (
    'Zip-Up Varsity Hoodie',
    'Varsity-style zip-up hoodie with ribbed cuffs and hem. Bold and athletic.',
    74.99, 89.99,
    'https://hoodrichuk.com/cdn/shop/files/Hoodrich12022623291_3417a3ea-f2f7-4082-9110-816c7b8b4643.jpg?v=1774453976&width=1800',
    'Hoodies', true, false, true, false, 'Sale'
  ),
  (
    'Oversized Graphic Tee',
    'Premium oversized tee with bold street graphics. 100% organic cotton.',
    34.99, NULL,
    'https://www.rockstaroriginal.com/cdn/shop/files/01_d1f1389b-5f62-450e-ac56-4a31dc522251.jpg?v=1777591161&width=1480',
    'T-Shirts', true, true, false, true, 'New'
  ),
  (
    'Essential Slim Fit Tee',
    'Clean, minimal slim-fit tee. Perfect base layer for any outfit.',
    24.99, NULL,
    'https://reigningchamp.com/cdn/shop/files/SS26_RC-1577_WHITE_T-SHIRT_off_jp.jpg?v=1771972826',
    'T-Shirts', true, false, false, false, NULL
  ),
  (
    'Striped Polo Tee',
    'Modern striped polo with a structured collar. Smart-casual essential.',
    39.99, 49.99,
    'https://rowingblazers.com/cdn/shop/files/needs-tag_RB0-5MAY25_POLO_STRIPE_FRONTcopy.jpg?v=1774313809',
    'T-Shirts', true, false, true, false, 'Sale'
  ),
  (
    'Urban Bomber Jacket',
    'Sleek bomber jacket with satin lining and ribbed details. A streetwear cornerstone.',
    119.99, NULL,
    'https://www.stussy.com/cdn/shop/files/115903_WHIT_1_fc3640d0-b301-49af-a88c-6689d74564bb.jpg?v=1773267104&width=1920',
    'Jackets', true, true, false, false, 'New'
  ),
  (
    'Cargo Utility Jacket',
    'Multi-pocket cargo jacket for the style-conscious. Heavy-duty fabric.',
    99.99, 129.99,
    'https://www.karllagerfeld.com/cdn/shop/files/B3M14022100_1.jpg?v=1783146066',
    'Jackets', true, false, true, false, 'Sale'
  ),
  (
    'Slim Fit Chinos',
    'Tailored slim-fit chinos that go from desk to street effortlessly.',
    54.99, NULL,
    -- This image is a file uploaded to the repo (artifacts/easy-brand/public/products/slim-fit-chinos.png)
    -- It will be served from your Netlify site at /products/slim-fit-chinos.png
    '/products/slim-fit-chinos.png',
    'Pants', true, false, false, true, NULL
  ),
  (
    'Jogger Sweatpants',
    'Cozy tapered joggers with elastic waistband. Built for the active lifestyle.',
    44.99, NULL,
    'https://zanerobe.com/cdn/shop/products/ZANEROBE-Orgo-Sureshot-Jogger-White-Noise-0.jpg?v=1690516848&width=2048',
    'Pants', true, true, false, false, 'New'
  ),
  (
    'Wide-Leg Track Pants',
    'Relaxed wide-leg track pants with side stripes. Statement streetwear.',
    49.99, 64.99,
    'https://pangaia.com/cdn/shop/files/365_MIDWEIGHT_TRACK_PANTS_OFF_WHITE_MENS_LEAD.jpg?crop=center&height=2132&v=1755183928&width=1600',
    'Pants', true, false, true, false, 'Sale'
  ),
  (
    'Denim Street Jacket',
    'Classic denim jacket with a modern streetwear cut. Versatile layering piece built to last.',
    89.99, NULL,
    'https://www.percivalclo.com/cdn/shop/files/WesternTruckerJacketDenimRaw_01.jpg?v=1768842352&width=1200',
    'Jackets', true, true, false, false, 'New'
  ),
  (
    'Cargo Shorts',
    'Relaxed-fit cargo shorts with multiple utility pockets. The ultimate summer streetwear staple.',
    44.99, 54.99,
    'https://mnml.la/cdn/shop/files/Distressed-Baggy-Cargo-Shorts-Off-White-3_1024x1024.jpg?v=1779268781',
    'Pants', true, false, true, false, 'Sale'
  )
ON CONFLICT DO NOTHING;
