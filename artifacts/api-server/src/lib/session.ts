import { randomUUID } from "crypto";
import type { Request, Response } from "express";

const SESSION_COOKIE = "eb_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

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

const sessions = new Map<string, SessionData>();

function createSession(): SessionData {
  return { cart: [], wishlist: [] };
}

export function getSessionId(req: Request, res: Response): string {
  let sid = req.cookies?.[SESSION_COOKIE];
  if (!sid || !sessions.has(sid)) {
    sid = randomUUID();
    sessions.set(sid, createSession());
    res.cookie(SESSION_COOKIE, sid, {
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
      sameSite: "lax",
    });
  }
  return sid;
}

export function getSession(sessionId: string): SessionData {
  let session = sessions.get(sessionId);
  if (!session) {
    session = createSession();
    sessions.set(sessionId, session);
  }
  return session;
}
