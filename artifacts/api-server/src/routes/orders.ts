import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable, ordersTable, orderItemsTable } from "@workspace/db";
import { PlaceOrderBody, GetOrderParams } from "@workspace/api-zod";
import { getSessionId, getSession } from "../lib/session";

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

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = PlaceOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, billingAddress, paymentMethod, note, items } = parsed.data;

  if (!items || items.length === 0) {
    res.status(400).json({ error: "Order must contain at least one item" });
    return;
  }

  // Fetch products
  const products = await db.select().from(productsTable);
  const productMap = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const orderItemData = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    const price = parseFloat(product.price);
    const lineTotal = price * item.quantity;
    total += lineTotal;
    return {
      productId: item.productId,
      productName: product.name,
      quantity: item.quantity,
      price,
      lineTotal,
    };
  });

  // Generate order number
  const orderNumber = Math.floor(100 + Math.random() * 900);

  const [order] = await db
    .insert(ordersTable)
    .values({
      orderNumber,
      email,
      total: total.toFixed(2),
      paymentMethod,
      status: "pending",
      note: note ?? null,
      billingAddress,
    })
    .returning();

  await db.insert(orderItemsTable).values(
    orderItemData.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      lineTotal: item.lineTotal.toFixed(2),
    }))
  );

  // Clear cart after order
  const sid = getSessionId(req, res);
  const session = getSession(sid);
  session.cart = [];

  const paymentMethodLabel =
    paymentMethod === "bank_transfer"
      ? "Direct bank transfer"
      : paymentMethod === "check"
      ? "Check payments"
      : "Cash on delivery";

  res.status(201).json({
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    email: order.email,
    total: parseFloat(order.total),
    paymentMethod: paymentMethodLabel,
    status: order.status,
    note: order.note ?? null,
    items: orderItemData.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      lineTotal: item.lineTotal,
    })),
    billingAddress,
  });
});

router.get("/orders/:orderNumber", async (req, res): Promise<void> => {
  const rawNum = Array.isArray(req.params.orderNumber)
    ? req.params.orderNumber[0]
    : req.params.orderNumber;
  const params = GetOrderParams.safeParse({ orderNumber: parseInt(rawNum, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid order number" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.orderNumber, params.data.orderNumber));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const orderItems = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, order.id));

  const paymentMethodLabel =
    order.paymentMethod === "bank_transfer"
      ? "Direct bank transfer"
      : order.paymentMethod === "check"
      ? "Check payments"
      : "Cash on delivery";

  res.json({
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    email: order.email,
    total: parseFloat(order.total),
    paymentMethod: paymentMethodLabel,
    status: order.status,
    note: order.note ?? null,
    items: orderItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: parseFloat(item.price),
      lineTotal: parseFloat(item.lineTotal),
    })),
    billingAddress: order.billingAddress,
  });
});

export default router;
