/**
 * Database-backed session store with in-memory fallback.
 *
 * When DATABASE_URL is set (Replit production / local dev):
 *   Sessions are persisted in the `sessions` PostgreSQL table as JSONB.
 *
 * When DATABASE_URL is not set (Netlify Functions without an external DB):
 *   Sessions are kept in a module-level Map for the lifetime of the function
 *   instance. Cart / wishlist work within a session but are not persisted
 *   across cold starts — acceptable for a demo / static deployment.
 */
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db, dbAvailable, sessionsTable } from "@workspace/db";
import type { SessionData } from "@workspace/db";

export type { CartItemData, WishlistItemData, SessionData } from "@workspace/db";

const SESSION_COOKIE = "eb_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

function emptySession(): SessionData {
  return { cart: [], wishlist: [] };
}

// ── In-memory fallback store ─────────────────────────────────────────────────
const memStore = new Map<string, SessionData>();

function memGetOrCreate(sid: string): SessionData {
  if (!memStore.has(sid)) memStore.set(sid, emptySession());
  return memStore.get(sid)!;
}

// ── Cookie helper ─────────────────────────────────────────────────────────────
function setCookie(res: Response, sid: string) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Read the session ID cookie, verify it exists in the DB, and return the ID.
 * Creates a new session row (and sets the cookie) when none exists.
 */
export async function getSessionId(req: Request, res: Response): Promise<string> {
  const existingSid = req.cookies?.[SESSION_COOKIE] as string | undefined;

  // ── DB path ──────────────────────────────────────────────────────────────────
  if (dbAvailable) {
    try {
      if (existingSid) {
        const [row] = await db
          .select({ id: sessionsTable.id })
          .from(sessionsTable)
          .where(eq(sessionsTable.id, existingSid));
        if (row) return row.id;
      }

      const sid = randomUUID();
      await db.insert(sessionsTable).values({ id: sid, data: emptySession() });
      setCookie(res, sid);
      return sid;
    } catch {
      // DB unreachable at runtime — fall through to in-memory
    }
  }

  // ── In-memory fallback ────────────────────────────────────────────────────────
  const sid = existingSid && memStore.has(existingSid) ? existingSid : randomUUID();
  memGetOrCreate(sid);
  setCookie(res, sid);
  return sid;
}

/**
 * Load session data from the DB (or memory). Creates a new row if missing.
 */
export async function getSession(sessionId: string): Promise<SessionData> {
  if (dbAvailable) {
    try {
      const [row] = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.id, sessionId));

      if (!row) {
        const data = emptySession();
        await db.insert(sessionsTable).values({ id: sessionId, data });
        return data;
      }

      return row.data as SessionData;
    } catch {
      // fall through to in-memory
    }
  }

  return memGetOrCreate(sessionId);
}

/**
 * Persist mutated session data back to the DB (or memory).
 */
export async function saveSession(
  sessionId: string,
  data: SessionData,
): Promise<void> {
  if (dbAvailable) {
    try {
      await db
        .update(sessionsTable)
        .set({ data, updatedAt: new Date() })
        .where(eq(sessionsTable.id, sessionId));
      return;
    } catch {
      // fall through to in-memory
    }
  }

  memStore.set(sessionId, data);
}
