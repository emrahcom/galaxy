// @ts-ignore
import { ServerRequest } from "https://deno.land/std/http/server.ts";
import {
  create,
  getNumericDate,
  Header,
  Payload,
  verify,
  // @ts-ignore
} from "https://deno.land/x/djwt/mod.ts";
// @ts-ignore
import { QueryResult } from "https://deno.land/x/postgres/query.ts";
import {
  JWT_ALG,
  JWT_AUD,
  JWT_ISS,
  JWT_SECRET,
  JWT_TIMEOUT,
  // @ts-ignore
} from "../config.ts";
import {
  internalServerError,
  methodNotAllowed,
  ok,
  parseRequestBody,
  unauthorized,
  // @ts-ignore
} from "./helpers.ts";
// @ts-ignore
import { query } from "../modules/database.ts";
// @ts-ignore
import { createToken, isAuthenticated, TokenReq } from "../modules/token.ts";

export interface UserPayload {
  iss: string;
  aud: string;
  exp: number;
  account: {
    id: number;
    email: string;
    admin: boolean;
  };
}

// ----------------------------------------------------------------------------
export async function sendToken(req: ServerRequest): Promise<void> {
  if (req.method !== "POST") return methodNotAllowed(req);

  const treq = await parseRequestBody<TokenReq>(req);
  const res = await isAuthenticated(treq).then(async (authenticated) => {
    if (!authenticated) return unauthorized(req);

    const jwt = await createToken(treq);
    (jwt) ? ok(req, JSON.stringify({ jwt: jwt })) : internalServerError(req);
  }).catch(() => {
    unauthorized(req);
  });

  return res;
}

// ----------------------------------------------------------------------------
export async function getPayload(req: ServerRequest): Promise<UserPayload> {
  const authorization = req.headers.get("authorization");
  if (!authorization) throw new Error("missing authorization header");

  const token = authorization.match("Bearer\\s+([0-9a-zA-Z.=_-]+)$");
  if (!token) throw new Error("missing bearer");

  const payload = await verify(token[1], JWT_SECRET, JWT_ALG);
  const userPayload: UserPayload = JSON.parse(JSON.stringify(payload));

  return userPayload;
}
