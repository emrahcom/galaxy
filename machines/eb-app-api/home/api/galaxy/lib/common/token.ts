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
  appAlg: string,
  roomName: string,
  username: string,
  email: string,
  exp = 3600,
): Promise<string> {
  let alg: Algorithm = "HS256";
  let hash = "SHA-256";
  if (appAlg === "HS512") {
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
  appAlg: string,
  roomName: string,
  username: string,
  email: string,
  exp = 3600,
): Promise<string> {
  let alg: Algorithm = "HS256";
  let hash = "SHA-256";
  if (appAlg === "HS512") {
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

// -----------------------------------------------------------------------------
async function generateCryptoKeyRS(
  privateKey: string,
  hash: string,
): Promise<CryptoKey> {
  const data = privateKey.replace(/---.*---/g, "").replace(/\n/g, "");
  const byteData = atob(data);
  const byteArray = new Uint8Array(byteData.length);
  for (let i = 0; i < byteData.length; i++) {
    byteArray[i] = byteData.charCodeAt(i);
  }

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    byteArray,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: hash,
    },
    true,
    ["sign", "verify"],
  );

  return cryptoKey;
}

// -----------------------------------------------------------------------------
export async function generateHostTokenRS(
  jaasAppId: string,
  jaasKid: string,
  jaasKey: string,
  jaasAlg: string,
  jaasAud: string,
  jaasIss: string,
  roomName: string,
  username: string,
  email: string,
  exp = 3600,
): Promise<string> {
  let alg: Algorithm = "RS256";
  let hash = "SHA-256";
  if (jaasAlg === "RS512") {
    alg = "RS512";
    hash = "SHA-512";
  }

  const header = { alg: alg, typ: "JWT", kid: jaasKid };
  const cryptoKey = await generateCryptoKeyRS(jaasKey, hash);
  const payload: Payload = {
    aud: jaasAud,
    iss: jaasIss,
    sub: jaasAppId,
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
