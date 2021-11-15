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
  let rst;
  let error: Error;

  try {
    const db = await dbPool.connect();
    rst = await db.queryObject(sql);
  } catch (e) {
    error = e;
  } finally {
    await db.release().catch();
  }

  if (error) {
    throw new Error(error);
  } else {
    return rst;
  }
}
