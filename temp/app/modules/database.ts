import { Pool } from "https://deno.land/x/postgres/mod.ts";
import { PoolClient } from "https://deno.land/x/postgres/client.ts";
import { QueryObjectConfig } from "https://deno.land/x/postgres/query/query.ts";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWD,
  DB_POOL_SIZE,
  DB_PORT,
  DB_USER,
} from "../config.ts";

const dbPool = new Pool({
  user: DB_USER,
  password: DB_PASSWD,
  database: DB_NAME,
  hostname: DB_HOST,
  port: DB_PORT,
}, DB_POOL_SIZE);

// ----------------------------------------------------------------------------
export async function query(sql: QueryObjectConfig) {
  const db: PoolClient = await dbPool.connect();
  const rst = await db.queryObject(sql);
  db.release();

  return rst;
}
