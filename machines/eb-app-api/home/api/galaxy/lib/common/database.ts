import { Pool, QueryObjectConfig } from "https://deno.land/x/postgres/mod.ts";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWD,
  DB_POOL_SIZE,
  DB_PORT,
  DB_USER,
} from "../../config.ts";

const dbPool = new Pool({
  user: DB_USER,
  password: DB_PASSWD,
  database: DB_NAME,
  hostname: DB_HOST,
  port: DB_PORT,
}, DB_POOL_SIZE);

// -----------------------------------------------------------------------------
export async function query(sql: QueryObjectConfig) {
  const db = await dbPool.connect();

  try {
    const rst = await db.queryObject(sql);
    return rst;
  } catch (e) {
    throw e;
  } finally {
    try {
      db.release();
    } catch {
      // do nothing
    }
  }
}

// -----------------------------------------------------------------------------
export interface idRows {
  [index: number]: {
    id: string;
    createdAt: string;
  };
}

// -----------------------------------------------------------------------------
export interface enabledRows {
  [index: number]: {
    id: string;
    enabled: boolean;
    updatedAt: string;
  };
}
