import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import { makeJwt, setExpiration } from "https://deno.land/x/djwt/create.ts";
import { Jose, Payload } from "https://deno.land/x/djwt/create.ts";

const key: string = "mysecret";
const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

export function isAuthenticated(req: ServerRequest): boolean {
  return true;
}

export default function (req: ServerRequest) {
  req.respond({
    body: "login",
  });
}
