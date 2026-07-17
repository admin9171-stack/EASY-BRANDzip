import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

/**
 * `dbAvailable` is true only when DATABASE_URL is set.
 * When false, `db` is undefined at runtime — all callers must guard with
 * `if (!dbAvailable)` before touching `db`.
 *
 * This allows the Netlify function bundle to load and serve static product
 * data without a live database connection.
 */
export let dbAvailable = false;
// Definite-assignment assertion: TypeScript trusts callers to check dbAvailable first.
export let db!: ReturnType<typeof drizzle<typeof schema>>;
export let pool: pg.Pool | undefined;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
  dbAvailable = true;
}

export * from "./schema";
