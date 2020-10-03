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

export function isAuthenticated(req: ServerRequest) {
  return true;
}

export async function login(req: ServerRequest) {
  if (req.method !== "POST") {
    req.respond({
      status: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    });
  }

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
