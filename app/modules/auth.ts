import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { decode, encode } from "https://deno.land/std@0.69.0/encoding/utf8.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import { makeJwt, setExpiration } from "https://deno.land/x/djwt/create.ts";
import { Jose, Payload } from "https://deno.land/x/djwt/create.ts";

const iss: string = "myapp";
const key: string = "mysecret";
const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

interface Credential {
  username: string;
  passwd: string;
}

// ----------------------------------------------------------------------------
const parseRequestBody = async <T>(req: ServerRequest): Promise<T> => {
  const buf = new Uint8Array(req.contentLength || 0);
  let bufSlice = buf;
  let totalRead = 0;

  while (true) {
    const nread = await req.body.read(bufSlice);
    if (nread === null) break;
    totalRead += nread;
    if (totalRead >= req.contentLength!) break;
    bufSlice = bufSlice.subarray(nread);
  }

  const str = new TextDecoder("utf-8").decode(bufSlice);
  return JSON.parse(str) as T;
};

// ----------------------------------------------------------------------------
export function isAuthenticated(req: ServerRequest) {
  return true;
}

// ----------------------------------------------------------------------------
export async function login(req: ServerRequest) {
  if (req.method !== "POST") {
    req.respond({
      status: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    });
  }

  const credential = await parseRequestBody<Credential>(req);
  console.log(credential);
  console.log(credential.username);

  const payload: Payload = {
    iss,
    exp: setExpiration(8 * 60 * 60),
    userid: 1000,
  };
  const jwt = await makeJwt({ header, payload, key });

  req.respond({
    body: JSON.stringify({ jwt: jwt }),
  });
}
