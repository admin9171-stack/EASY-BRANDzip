import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export interface CartItemData {
  productId: number;
  quantity: number;
}

export interface WishlistItemData {
  productId: number;
}

export interface SessionData {
  cart: CartItemData[];
  wishlist: WishlistItemData[];
}

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  data: jsonb("data").$type<SessionData>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
