import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { decode, encode } from "https://deno.land/std@0.69.0/encoding/utf8.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import { makeJwt, setExpiration } from "https://deno.land/x/djwt/create.ts";
import { Jose, Payload } from "https://deno.land/x/djwt/create.ts";
import { JWT_ISS, JWT_KEY } from "../config.ts";
import { internalServerError, methodNotAllowed, ok } from "./helpers.ts";
import { parseRequestBody, unauthorized } from "./helpers.ts";

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

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
  const payload: Payload = {
    iss: JWT_ISS,
    exp: setExpiration(8 * 60 * 60),
    user: credential.username,
  };

  try {
    const token = await makeJwt({ header, payload, key: JWT_KEY });
    return token;
  } catch (error) {
    return "";
  }
};

// ----------------------------------------------------------------------------
export const hasToken = async (req: ServerRequest): Promise<boolean> => {
  return true;
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
