import { create, getNumericDate, Payload } from "jsr:@zaubrik/djwt@3.0.2";

// https://github.com/Zaubrik/djwt/blob/master/algorithm.ts
type Algorithm =
  | "HS256"
  | "HS384"
  | "HS512"
  | "PS256"
  | "PS384"
  | "PS512"
  | "RS256"
  | "RS384"
  | "RS512"
  | "ES256"
  | "ES384"
  | "none";

// -----------------------------------------------------------------------------
export async function generateCryptoKeyHS(
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
        moderator: true,
        "lobby_bypass": true,
        "security_bypass": true,
      },
      features: {
        livestreaming: true,
        recording: true,
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
        moderator: false,
      },
      features: {
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
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = privateKey.substring(
    pemHeader.length,
    privateKey.length - pemFooter.length,
  );
  const binaryDerString = atob(pemContents);
  const keyData = new ArrayBuffer(binaryDerString.length);
  const bufView = new Uint8Array(keyData);
  for (let i = 0; i < binaryDerString.length; i++) {
    bufView[i] = binaryDerString.charCodeAt(i);
  }

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: hash,
    },
    true,
    ["sign"],
  );

  return cryptoKey;
}

// -----------------------------------------------------------------------------
export async function generateHostTokenJaas(
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
        moderator: true,
      },
      features: {
        livestreaming: true,
        recording: true,
        transcription: true,
        "screen-sharing": true,
        "sip-inbound-call": true,
        "sip-outbound-call": true,
      },
    },
  };

  const jwt = await create(header, payload, cryptoKey);

  return jwt;
}

// -----------------------------------------------------------------------------
export async function generateGuestTokenJaas(
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
        affiliation: "member",
        moderator: false,
      },
      features: {
        "screen-sharing": true,
      },
    },
  };

  const jwt = await create(header, payload, cryptoKey);

  return jwt;
}
