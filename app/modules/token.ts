import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { Header, Payload } from "https://deno.land/x/djwt/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";
import { getNumericDate } from "https://deno.land/x/djwt/mod.ts";
import { QueryResult } from "https://deno.land/x/postgres/query.ts";
import { JWT_ALG, JWT_SECRET } from "../config.ts";
import { JWT_AUD, JWT_ISS, JWT_TIMEOUT } from "../config.ts";
import { internalServerError, methodNotAllowed, ok } from "./helpers.ts";
import { parseRequestBody, unauthorized } from "./helpers.ts";
import { query } from "./database.ts";

interface TokenReq {
  email: string;
  passwd: string;
}

// ----------------------------------------------------------------------------
async function isAuthenticated(treq: TokenReq): Promise<boolean> {
  if (treq.email === undefined) throw new Error("missing email");
  if (treq.passwd === undefined) throw new Error("missing password");

  let sql = {
    text: `
      SELECT *
      FROM account
      WHERE email = $1
        AND passwd = $2
        AND active = true`,
    args: [
      treq.email,
      treq.passwd,
    ],
  };

  const rst: QueryResult = await query(sql);

  return rst.rowCount && rst.rowCount > 0 ? true : false;
}

// ----------------------------------------------------------------------------
async function createToken(treq: TokenReq): Promise<string> {
  const header: Header = {
    alg: JWT_ALG,
    typ: "JWT",
  };

  const payload: Payload = {
    iss: JWT_ISS,
    aud: JWT_AUD,
    exp: getNumericDate(JWT_TIMEOUT),
    account: {
      id: 123,
      name: treq.email,
    },
  };

  const jwt = await create(header, payload, JWT_SECRET).catch(() => {
    return "";
  });

  return jwt;
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
export async function getPayload(req: ServerRequest): Promise<Payload> {
  const authorization = req.headers.get("authorization");
  if (!authorization) throw new Error("missing authorization header");

  const token = authorization.match("Bearer\\s+([0-9a-zA-Z.=_-]+)$");
  if (!token) throw new Error("missing bearer");

  return await verify(token[1], JWT_SECRET, JWT_ALG);
}
