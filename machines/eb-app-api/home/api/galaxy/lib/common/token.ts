import { Algorithm } from "https://deno.land/x/djwt/algorithm.ts";
import {
  create,
  getNumericDate,
  Payload,
} from "https://deno.land/x/djwt/mod.ts";

// -----------------------------------------------------------------------------
async function getCryptoKey(secret: string, hash: string): Promise<CryptoKey> {
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
export async function createHostToken(
  appId: string,
  appSecret: string,
  roomName: string,
  username: string,
  email: string,
  exp = 86400,
): string {
  const alg: Algorithm = "HS512";
  const hash = "SHA-512";

  const header = { alg: alg, typ: "JWT" };
  const cryptoKey = await getCryptoKey(appSecret, hash);
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
