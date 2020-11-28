import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { Header, Payload } from "https://deno.land/x/djwt/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";
import { getNumericDate } from "https://deno.land/x/djwt/mod.ts";
import { JWT_ALG, JWT_SECRET } from "../config.ts";
import { JWT_AUD, JWT_ISS, JWT_TIMEOUT } from "../config.ts";
import { internalServerError, methodNotAllowed, ok } from "./helpers.ts";
import { parseRequestBody, unauthorized } from "./helpers.ts";

interface Credential {
  username: string;
  passwd: string;
}

// ----------------------------------------------------------------------------
const isAuthenticated = async (credential: Credential): Promise<boolean> => {
  if (credential.username === undefined) return false;
  if (credential.passwd === undefined) return false;

  return true;
};

// ----------------------------------------------------------------------------
const createToken = async (credential: Credential): Promise<string> => {
  const header: Header = {
    alg: JWT_ALG,
    typ: "JWT",
  };

  const payload: Payload = {
    iss: JWT_ISS,
    aud: JWT_AUD,
    exp: getNumericDate(JWT_TIMEOUT),
    user: credential.username,
  };

  try {
    const token = await create(header, payload, JWT_SECRET);
    return token;
  } catch (error) {
    return "";
  }
};

// ----------------------------------------------------------------------------
export const login = async (req: ServerRequest): Promise<void> => {
  if (req.method !== "POST") {
    methodNotAllowed(req);
    return;
  }

  const credential = await parseRequestBody<Credential>(req);
  if (!await isAuthenticated(credential)) {
    unauthorized(req);
    return;
  }

  const jwt = await createToken(credential);
  (jwt) ? ok(req, JSON.stringify({ jwt: jwt })) : internalServerError(req);
};

// ----------------------------------------------------------------------------
export const hasValidToken = async (req: ServerRequest): Promise<boolean> => {
  const authorization = req.headers.get("authorization");
  if (!authorization) {
    return false;
  }

  const token = authorization.match("Bearer\\s+([0-9a-zA-Z.=_-]+)$");
  if (!token) {
    return false;
  }

  const isValid = await verify(token[1], JWT_SECRET, JWT_ALG).then(() => {
    return true;
  }).catch(() => {
    return false;
  });

  return isValid;
};
