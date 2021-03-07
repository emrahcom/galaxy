import { ServerRequest } from "https://deno.land/std/http/server.ts";
import {
  create,
  getNumericDate,
  Header,
  Payload,
  verify,
} from "https://deno.land/x/djwt/mod.ts";
import { QueryResult } from "https://deno.land/x/postgres/query.ts";
import {
  JWT_ALG,
  JWT_AUD,
  JWT_ISS,
  JWT_SECRET,
  JWT_TIMEOUT,
} from "../config.ts";
import {
  internalServerError,
  methodNotAllowed,
  ok,
  parseRequestBody,
  unauthorized,
} from "./helpers.ts";
import { query } from "../modules/database.ts";
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

  let treq: TokenReq;
  try {
    treq = await parseRequestBody<TokenReq>(req);
    if (!await isAuthenticated(treq)) throw new Error("unknown user");
  } catch (e) {
    return unauthorized(req);
  }

  await createToken(treq)
    .then((jwt) => {
      return ok(req, JSON.stringify({ jwt: jwt }));
    })
    .catch((e) => {
      return internalServerError(req);
    });
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
