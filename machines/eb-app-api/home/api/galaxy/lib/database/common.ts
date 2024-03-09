import { Pool } from "https://deno.land/x/postgres/mod.ts";
import {
  QueryArguments,
  QueryObjectResult,
} from "https://deno.land/x/postgres/query/query.ts";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWD,
  DB_POOL_SIZE,
  DB_PORT,
  DB_USER,
  DEFAULT_LIST_SIZE,
  MAX_LIST_SIZE,
} from "../../config.ts";
import type { Meta } from "./types.ts";

interface QueryObject {
  text: string;
  args?: QueryArguments;
}

const dbPool = new Pool({
  user: DB_USER,
  password: DB_PASSWD,
  database: DB_NAME,
  hostname: DB_HOST,
  port: DB_PORT,
}, DB_POOL_SIZE);

// -----------------------------------------------------------------------------
export async function query(
  sql: QueryObject,
): Promise<QueryObjectResult<unknown>> {
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
export async function fetch(sql: QueryObject): Promise<unknown> {
  const rows = await query(sql)
    .then((rst) => {
      return rst.rows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function getVersion() {
  const sql = {
    text: `
      SELECT mvalue
      FROM metadata
      WHERE mkey = 'database_version'`,
  };
  const rows = await fetch(sql) as Meta[];

  return rows[0].mvalue;
}

// -----------------------------------------------------------------------------
export function getLimit(limit: number): number {
  if (!limit) {
    limit = DEFAULT_LIST_SIZE;
  } else if (limit > MAX_LIST_SIZE) {
    limit = MAX_LIST_SIZE;
  }

  return limit + 0;
}

// -----------------------------------------------------------------------------
export function getOffset(offset: number): number {
  if (!offset) offset = 0;

  return offset + 0;
}
