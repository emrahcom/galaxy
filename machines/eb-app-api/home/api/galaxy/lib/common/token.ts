import { Algorithm } from "https://deno.land/x/djwt/algorithm.ts";
import {
  create,
  getNumericDate,
  Payload,
} from "https://deno.land/x/djwt/mod.ts";

// -----------------------------------------------------------------------------
async function generateCryptoKeyHS(
  secret: string,
  hash: string,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "HMAC",
      hash: hash,
    },
    true,
    ["sign", "verify"],
  );

  return cryptoKey;
}

// -----------------------------------------------------------------------------
export async function generateHostTokenHS(
  appId: string,
  appSecret: string,
  appAlgo: string,
  roomName: string,
  username: string,
  email: string,
  exp = 3600,
): Promise<string> {
  let alg: Algorithm = "HS256";
  let hash = "SHA-256";
  if (appAlgo === "HS512") {
    alg = "HS512";
    hash = "SHA-512";
  }

  const header = { alg: alg, typ: "JWT" };
  const cryptoKey = await generateCryptoKeyHS(appSecret, hash);
  const payload: Payload = {
    aud: appId,
    iss: appId,
    sub: "*",
    room: roomName,
    iat: getNumericDate(0),
    exp: getNumericDate(exp),
    context: {
      user: {
        name: username,
        email: email,
        affiliation: "owner",
      },
      features: {
        recording: true,
        livestreaming: true,
        "screen-sharing": true,
      },
    },
  };

  const jwt = await create(header, payload, cryptoKey);

  return jwt;
}

// -----------------------------------------------------------------------------
export async function generateGuestTokenHS(
  appId: string,
  appSecret: string,
  appAlgo: string,
  roomName: string,
  username: string,
  email: string,
  exp = 3600,
): Promise<string> {
  let alg: Algorithm = "HS256";
  let hash = "SHA-256";
  if (appAlgo === "HS512") {
    alg = "HS512";
    hash = "SHA-512";
  }

  const header = { alg: alg, typ: "JWT" };
  const cryptoKey = await generateCryptoKeyHS(appSecret, hash);
  const payload: Payload = {
    aud: appId,
    iss: appId,
    sub: "*",
    room: roomName,
    iat: getNumericDate(0),
    exp: getNumericDate(exp),
    context: {
      user: {
        name: username,
        email: email,
        affiliation: "member",
      },
      features: {
        recording: false,
        livestreaming: false,
        "screen-sharing": true,
      },
    },
  };

  const jwt = await create(header, payload, cryptoKey);

  return jwt;
}
