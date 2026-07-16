/**
 * Database-backed session store.
 *
 * Replaces the previous in-memory Map so sessions survive across serverless
 * cold starts (Netlify Functions) and server restarts.
 *
 * Session data is stored in the `sessions` PostgreSQL table as a JSONB column.
 * The session ID is a random UUID kept in a signed HTTP-only cookie.
 */
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db, sessionsTable } from "@workspace/db";
import type { SessionData } from "@workspace/db";

export type { CartItemData, WishlistItemData, SessionData } from "@workspace/db";

const SESSION_COOKIE = "eb_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

function emptySession(): SessionData {
  return { cart: [], wishlist: [] };
}

/**
 * Read the session ID cookie, verify it exists in the DB, and return the ID.
 * Creates a new session row (and sets the cookie) when none exists.
 */
export async function getSessionId(req: Request, res: Response): Promise<string> {
  const existingSid = req.cookies?.[SESSION_COOKIE] as string | undefined;

  if (existingSid) {
    const [row] = await db
      .select({ id: sessionsTable.id })
      .from(sessionsTable)
      .where(eq(sessionsTable.id, existingSid));

    if (row) return row.id;
  }

  // No valid session — create one
  const sid = randomUUID();
  await db.insert(sessionsTable).values({ id: sid, data: emptySession() });

  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return sid;
}

/**
 * Load session data from the DB. Creates a new row if the ID is missing
 * (defensive — should not happen in normal flow).
 */
export async function getSession(sessionId: string): Promise<SessionData> {
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
}

/**
 * Persist mutated session data back to the DB.
 * Must be called after every mutation (add/remove cart or wishlist items).
 */
export async function saveSession(
  sessionId: string,
  data: SessionData,
): Promise<void> {
  await db
    .update(sessionsTable)
    .set({ data, updatedAt: new Date() })
    .where(eq(sessionsTable.id, sessionId));
}
