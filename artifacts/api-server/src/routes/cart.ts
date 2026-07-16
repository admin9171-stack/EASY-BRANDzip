import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import { AddCartItemBody, UpdateCartItemBody, UpdateCartItemParams, RemoveCartItemParams } from "@workspace/api-zod";
import { getSessionId, getSession, saveSession } from "../lib/session";

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

async function buildCartResponse(sessionId: string) {
  const session = await getSession(sessionId);
  const cartItems = session.cart;

  if (cartItems.length === 0) {
    return { items: [], subtotal: 0, total: 0, itemCount: 0 };
  }

  const products = await db.select().from(productsTable);
  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  let itemCount = 0;
  const items = cartItems
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      const unitPrice = parseFloat(product.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      itemCount += item.quantity;
      return {
        productId: item.productId,
        product: formatProduct(product),
        quantity: item.quantity,
        lineTotal,
      };
    })
    .filter(Boolean);

  return { items, subtotal, total: subtotal, itemCount };
}

router.get("/cart", async (req, res): Promise<void> => {
  const sid = await getSessionId(req, res);
  const cart = await buildCartResponse(sid);
  res.json(cart);
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const parsed = AddCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { productId, quantity } = parsed.data;
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const sid = await getSessionId(req, res);
  const session = await getSession(sid);
  const existing = session.cart.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    session.cart.push({ productId, quantity });
  }
  await saveSession(sid, session);

  const cart = await buildCartResponse(sid);
  res.json(cart);
});

router.put("/cart/items/:productId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const params = UpdateCartItemParams.safeParse({ productId: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const bodyParsed = UpdateCartItemBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const sid = await getSessionId(req, res);
  const session = await getSession(sid);
  const item = session.cart.find((i) => i.productId === params.data.productId);
  if (item) {
    item.quantity = Math.max(1, bodyParsed.data.quantity);
  }
  await saveSession(sid, session);

  const cart = await buildCartResponse(sid);
  res.json(cart);
});

router.delete("/cart/items/:productId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const params = RemoveCartItemParams.safeParse({ productId: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const sid = await getSessionId(req, res);
  const session = await getSession(sid);
  session.cart = session.cart.filter((i) => i.productId !== params.data.productId);
  await saveSession(sid, session);

  const cart = await buildCartResponse(sid);
  res.json(cart);
});

router.delete("/cart/clear", async (req, res): Promise<void> => {
  const sid = await getSessionId(req, res);
  const session = await getSession(sid);
  session.cart = [];
  await saveSession(sid, session);
  res.json({ items: [], subtotal: 0, total: 0, itemCount: 0 });
});

export default router;
