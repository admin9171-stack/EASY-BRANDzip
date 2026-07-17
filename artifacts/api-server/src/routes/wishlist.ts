import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, dbAvailable, productsTable } from "@workspace/db";
import { AddWishlistItemBody, RemoveWishlistItemParams } from "@workspace/api-zod";
import { getSessionId, getSession, saveSession } from "../lib/session.js";
import { getStaticProductMap } from "../data/static-catalog.js";

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

/**
 * Returns a Map<id, FormattedProduct> from either the live DB or static data.
 */
async function getProductMap(): Promise<Map<number, ReturnType<typeof formatProduct>>> {
  if (dbAvailable) {
    try {
      const products = await db.select().from(productsTable);
      return new Map(products.map((p) => [p.id, formatProduct(p)]));
    } catch {
      // fall through to static
    }
  }
  return getStaticProductMap() as Map<number, ReturnType<typeof formatProduct>>;
}

async function buildWishlistResponse(sessionId: string) {
  const session = await getSession(sessionId);
  const wishlistItems = session.wishlist;

  if (wishlistItems.length === 0) {
    return { items: [], itemCount: 0 };
  }

  const productMap = await getProductMap();

  const items = wishlistItems
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      return { productId: item.productId, product };
    })
    .filter(Boolean);

  return { items, itemCount: items.length };
}

router.get("/wishlist", async (req, res): Promise<void> => {
  const sid = await getSessionId(req, res);
  const wishlist = await buildWishlistResponse(sid);
  res.json(wishlist);
});

router.post("/wishlist/items", async (req, res): Promise<void> => {
  const parsed = AddWishlistItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { productId } = parsed.data;

  // Verify product exists (DB or static)
  const productMap = await getProductMap();
  if (!productMap.has(productId)) {
    if (dbAvailable) {
      try {
        const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
        if (!product) {
          res.status(404).json({ error: "Product not found" });
          return;
        }
      } catch {
        res.status(404).json({ error: "Product not found" });
        return;
      }
    } else {
      res.status(404).json({ error: "Product not found" });
      return;
    }
  }

  const sid = await getSessionId(req, res);
  const session = await getSession(sid);
  if (!session.wishlist.find((i) => i.productId === productId)) {
    session.wishlist.push({ productId });
  }
  await saveSession(sid, session);

  const wishlist = await buildWishlistResponse(sid);
  res.json(wishlist);
});

router.delete("/wishlist/items/:productId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const params = RemoveWishlistItemParams.safeParse({ productId: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const sid = await getSessionId(req, res);
  const session = await getSession(sid);
  session.wishlist = session.wishlist.filter((i) => i.productId !== params.data.productId);
  await saveSession(sid, session);

  const wishlist = await buildWishlistResponse(sid);
  res.json(wishlist);
});

export default router;
