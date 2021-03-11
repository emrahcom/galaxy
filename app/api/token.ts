import { ServerRequest } from "https://deno.land/std/http/server.ts";
import {
  create,
  getNumericDate,
  Header,
  Payload,
  verify,
} from "https://deno.land/x/djwt/mod.ts";
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
import { createToken, getUserId, TokenReq } from "../modules/token.ts";

export interface UserPayload {
  iss: string;
  aud: string;
  exp: number;
  uid: string;
}

// ----------------------------------------------------------------------------
export async function sendToken(req: ServerRequest): Promise<void> {
  if (req.method !== "POST") return methodNotAllowed(req);

  let uid: string;
  try {
    const treq = await parseRequestBody<TokenReq>(req);
    uid = await getUserId(treq);
  } catch (e) {
    return unauthorized(req);
  }

  await createToken(uid)
    .then((jwt) => {
      return ok(req, JSON.stringify({ jwt: jwt }));
    })
    .catch((e) => {
      return internalServerError(req);
    });
}

// ----------------------------------------------------------------------------
export async function getPayload(req: ServerRequest): Promise<UserPayload> {
  const auth = req.headers.get("authorization");
  if (!auth) throw new Error("missing authorization header");

  const token = auth.match("Bearer\\s+([0-9a-zA-Z.=_-]+)$");
  if (!token) throw new Error("missing bearer");

  const pl = await verify(token[1], JWT_SECRET, JWT_ALG);
  return JSON.parse(JSON.stringify(pl));
}
