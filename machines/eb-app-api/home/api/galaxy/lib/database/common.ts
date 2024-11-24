import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import {
  QueryArguments,
  QueryObjectResult,
} from "https://deno.land/x/postgres@v0.19.3/query/query.ts";
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
import type { Attr, Meta } from "./types.ts";

export interface QueryObject {
  text: string;
  args?: QueryArguments;
}

export const pool = new Pool(
  {
    user: DB_USER,
    password: DB_PASSWD,
    database: DB_NAME,
    hostname: DB_HOST,
    port: DB_PORT,
  },
  DB_POOL_SIZE,
  true,
);

// -----------------------------------------------------------------------------
export async function query(sql: QueryObject): Promise<QueryObjectResult> {
  try {
    using client = await pool.connect();
    const rst = await client.queryObject(sql);

    return rst as QueryObjectResult;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// -----------------------------------------------------------------------------
export async function fetch(sql: QueryObject): Promise<object[]> {
  const rows = await query(sql)
    .then((rst) => {
      return rst.rows;
    });

  return rows as object[];
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

// -----------------------------------------------------------------------------
// The attribute type is used in JSON columns of tables. It is a list of
// (key, value) pairs. Only string values are allowed otherwise codes become
// more complicates.
//
// Use
//
//   a_b_c = "value"
//
// to simulate
//
//   a = {
//     b = {
//       c = "value"
//     }
//   }
// -----------------------------------------------------------------------------
export function checkAttr(attr: Attr) {
  for (const key in attr) {
    if (typeof attr[key] !== "string") throw "none string value";
  }
}
