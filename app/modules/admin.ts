import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { Header, Payload } from "https://deno.land/x/djwt/mod.ts";
import { create } from "https://deno.land/x/djwt/mod.ts";
import { getNumericDate } from "https://deno.land/x/djwt/mod.ts";
import { QueryResult } from "https://deno.land/x/postgres/query.ts";
import { JWT_ALG, JWT_SECRET } from "../config.ts";
import { JWT_ADMIN_TIMEOUT, JWT_AUD, JWT_ISS } from "../config.ts";
import { internalServerError, methodNotAllowed, ok } from "./helpers.ts";
import { parseRequestBody, unauthorized } from "./helpers.ts";
import { query } from "./database.ts";

interface AdminTokenReq {
  passwd: string;
}

// ----------------------------------------------------------------------------
async function isAdminAuthenticated(treq: AdminTokenReq): Promise<boolean> {
  if (treq.passwd === undefined) throw new Error("missing password");

  let sql = {
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
async function createAdminToken(treq: AdminTokenReq): Promise<string> {
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

// ----------------------------------------------------------------------------
export async function sendAdminToken(req: ServerRequest): Promise<void> {
  if (req.method !== "POST") return methodNotAllowed(req);

  const treq = await parseRequestBody<AdminTokenReq>(req);
  const res = await isAdminAuthenticated(treq).then(async (authenticated) => {
    if (!authenticated) return unauthorized(req);

    const jwt = await createAdminToken(treq);
    (jwt) ? ok(req, JSON.stringify({ jwt: jwt })) : internalServerError(req);
  }).catch(() => {
    unauthorized(req);
  });

  return res;
}
