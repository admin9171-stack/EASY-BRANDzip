import { Router, type IRouter } from "express";
import { eq, and, ilike, or, type SQL } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  GetProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    originalPrice: p.originalPrice != null ? parseFloat(p.originalPrice) : null,
    image: p.image,
    category: p.category,
    inStock: p.inStock,
    isFeatured: p.isFeatured,
    isOnSale: p.isOnSale,
    isBestSelling: p.isBestSelling,
    badge: p.badge ?? null,
  };
}

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const filters = parsed.data;
  const conditions: SQL[] = [];

  if (filters.category) {
    conditions.push(eq(productsTable.category, filters.category));
  }
  if (filters.featured === true) {
    conditions.push(eq(productsTable.isFeatured, true));
  }
  if (filters.onSale === true) {
    conditions.push(eq(productsTable.isOnSale, true));
  }
  if (filters.bestSelling === true) {
    conditions.push(eq(productsTable.isBestSelling, true));
  }
  if (filters.search) {
    conditions.push(
      or(
        ilike(productsTable.name, `%${filters.search}%`),
        ilike(productsTable.description, `%${filters.search}%`)
      ) as SQL
    );
  }

  const products =
    conditions.length > 0
      ? await db.select().from(productsTable).where(and(...conditions))
      : await db.select().from(productsTable);

  res.json(products.map(formatProduct));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(formatProduct(product));
});

router.get("/categories", async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  res.json(cats.map((c) => ({ id: c.id, name: c.name, slug: c.slug })));
});

export default router;
