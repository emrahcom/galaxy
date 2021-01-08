// @ts-ignore
import { Pool } from "https://deno.land/x/postgres/mod.ts";
// @ts-ignore
import { PoolClient } from "https://deno.land/x/postgres/client.ts";
import {
  QueryConfig,
  QueryResult,
  // @ts-ignore
} from "https://deno.land/x/postgres/query.ts";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWD,
  DB_POOL_SIZE,
  DB_PORT,
  DB_USER,
  // @ts-ignore
} from "../config.ts";

const dbPool = new Pool({
  user: DB_USER,
  password: DB_PASSWD,
  database: DB_NAME,
  hostname: DB_HOST,
  port: DB_PORT,
}, DB_POOL_SIZE);

// ----------------------------------------------------------------------------
export async function query(sql: string | QueryConfig): Promise<QueryResult> {
  const db: PoolClient = await dbPool.connect();
  const rst: QueryResult = await db.query(sql);
  db.release();

  return rst;
}
