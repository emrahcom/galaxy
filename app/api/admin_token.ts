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
import {
  internalServerError,
  methodNotAllowed,
  ok,
  parseRequestBody,
  unauthorized,
} from "./helpers.ts";
import { query } from "../modules/database.ts";
import {
  AdminTokenReq,
  createAdminToken,
  isAdminAuthenticated,
} from "../modules/admin_token.ts";

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
