import { ServerRequest } from "https://deno.land/std/http/server.ts";
import {
  create,
  getNumericDate,
  Header,
  Payload,
} from "https://deno.land/x/djwt/mod.ts";
import { QueryResult } from "https://deno.land/x/postgres/query.ts";
import {
  JWT_ADMIN_TIMEOUT,
  JWT_ALG,
  JWT_AUD,
  JWT_ISS,
  JWT_SECRET,
} from "../config.ts";
import { query } from "../modules/database.ts";

export interface AdminTokenReq {
  passwd: string;
}

// ----------------------------------------------------------------------------
export async function isAdminAuthenticated(
  treq: AdminTokenReq,
): Promise<boolean> {
  if (treq.passwd === undefined) throw new Error("missing password");

  const sql = {
    text: `
      SELECT *
      FROM param
      WHERE key = 'admin-passwd'
        AND value = crypt($1, value)`,
    args: [
      treq.passwd,
    ],
  };

  const rst: QueryResult = await query(sql);

  return rst.rowCount && rst.rowCount > 0 ? true : false;
}

// ----------------------------------------------------------------------------
export async function createAdminToken(treq: AdminTokenReq): Promise<string> {
  const header: Header = {
    alg: JWT_ALG,
    typ: "JWT",
  };

  const payload: Payload = {
    iss: JWT_ISS,
    aud: JWT_AUD,
    exp: getNumericDate(JWT_ADMIN_TIMEOUT),
    account: {
      admin: true,
    },
  };

  const jwt = await create(header, payload, JWT_SECRET).catch(() => {
    return "";
  });

  return jwt;
}
