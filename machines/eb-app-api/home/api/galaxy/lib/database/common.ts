import { Pool, QueryObjectConfig } from "https://deno.land/x/postgres/mod.ts";
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
export function getLimit(limit: number) {
  if (!limit) {
    limit = DEFAULT_LIST_SIZE;
  } else if (limit > MAX_LIST_SIZE) {
    limit = MAX_LIST_SIZE;
  }

  return limit + 0;
}

// -----------------------------------------------------------------------------
export function getOffset(offset: number) {
  if (!offset) offset = 0;

  return offset + 0;
}

// -----------------------------------------------------------------------------
export interface idRows {
  [index: number]: {
    id: string;
    at: string;
  };
}

// -----------------------------------------------------------------------------
export interface roomRows {
  [index: number]: {
    id: string;
    name: string;
    domain_id: string;
    domain_name: string;
    has_suffix: boolean;
    suffix: string;
    enabled: boolean;
    chain_enabled: boolean;
    created_at: string;
    updated_at: string;
    accessed_at: string;
  };
}

// -----------------------------------------------------------------------------
export interface inviteRows {
  [index: number]: {
    id: string;
    meeting_id: string;
    meeting_name: string;
    meeting_info: string;
    code: string;
    as_host: boolean;
    enabled: boolean;
    created_at: string;
    updated_at: string;
    expired_at: string;
  };
}

// -----------------------------------------------------------------------------
export interface pubInviteRows {
  [index: number]: {
    meeting_name: string;
    meeting_info: string;
    code: string;
    as_host: boolean;
    expired_at: string;
  };
}

// -----------------------------------------------------------------------------
export interface membershipRows {
  [index: number]: {
    id: string;
    profile_id: string;
    meeting_id: string;
    meeting_name: string;
    meeting_info: string;
    is_host: boolean;
    enabled: boolean;
    created_at: string;
    updated_at: string;
  };
}

// -----------------------------------------------------------------------------
export interface memberRows {
  [index: number]: {
    id: string;
    profile_name: string;
    is_host: boolean;
    enabled: boolean;
    created_at: string;
    updated_at: string;
  };
}
