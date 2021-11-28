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
    at: string;
  };
}

// -----------------------------------------------------------------------------
export interface domainRows {
  [index: number]: {
    id: string;
    name: string;
    auth_type: string;
    auth_attr: unknown;
    enabled: boolean;
    created_at: string;
    updated_at: string;
  };
}

// -----------------------------------------------------------------------------
export interface narrowedDomainRows {
  [index: number]: {
    id: string;
    name: string;
    enabled: boolean;
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
    ephemeral: boolean;
    enabled: boolean;
    created_at: string;
    updated_at: string;
    accessed_at: string;
  };
}

// -----------------------------------------------------------------------------
export interface meetingRows {
  [index: number]: {
    id: string;
    name: string;
    room_id: string;
    room_name: string;
    info: string;
    schedule_type: string;
    schedule_attr: unknown;
    scheduled_at: string;
    hidden: boolean;
    restricted: boolean;
    enabled: boolean;
    created_at: string;
    updated_at: string;
  };
}

// -----------------------------------------------------------------------------
export interface narrowedMeetingRows {
  [index: number]: {
    id: string;
    name: string;
    info: string;
    schedule_type: string;
    schedule_attr: unknown;
    restricted: boolean;
    enabled: boolean;
  };
}
