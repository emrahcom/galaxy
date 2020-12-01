import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { Header, Payload } from "https://deno.land/x/djwt/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";
import { getNumericDate } from "https://deno.land/x/djwt/mod.ts";
import { JWT_ALG, JWT_SECRET } from "../config.ts";
import { JWT_AUD, JWT_ISS, JWT_TIMEOUT } from "../config.ts";
import { internalServerError, methodNotAllowed, ok } from "./helpers.ts";
import { parseRequestBody, unauthorized } from "./helpers.ts";

interface TokenReq {
  username: string;
  passwd: string;
}

// ----------------------------------------------------------------------------
async function isAuthenticated(treq: TokenReq): Promise<boolean> {
  if (treq.username === undefined) throw new Error("missing username");
  if (treq.passwd === undefined) throw new Error("missing password");

  return true;
}

// ----------------------------------------------------------------------------
async function createJWT(treq: TokenReq): Promise<string> {
  const header: Header = {
    alg: JWT_ALG,
    typ: "JWT",
  };

  const payload: Payload = {
    iss: JWT_ISS,
    aud: JWT_AUD,
    exp: getNumericDate(JWT_TIMEOUT),
    user: treq.username,
  };

  const jwt = await create(header, payload, JWT_SECRET).catch(() => {
    return "";
  });

  return jwt;
}

// ----------------------------------------------------------------------------
export async function createToken(req: ServerRequest): Promise<void> {
  if (req.method !== "POST") return methodNotAllowed(req);

  const treq = await parseRequestBody<TokenReq>(req);
  const res = await isAuthenticated(treq).then(async () => {
    const jwt = await createJWT(treq);
    (jwt) ? ok(req, JSON.stringify({ jwt: jwt })) : internalServerError(req);
  }).catch(() => {
    unauthorized(req);
  });

  return res;
}

// ----------------------------------------------------------------------------
export async function hasValidToken(req: ServerRequest): Promise<boolean> {
  const authorization = req.headers.get("authorization");
  if (!authorization) return false;

  const token = authorization.match("Bearer\\s+([0-9a-zA-Z.=_-]+)$");
  if (!token) return false;

  const isValid = await verify(token[1], JWT_SECRET, JWT_ALG).then(() => {
    return true;
  }).catch(() => {
    return false;
  });

  return isValid;
}
