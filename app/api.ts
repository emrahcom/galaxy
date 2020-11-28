import { serve, Server } from "https://deno.land/std/http/server.ts";
import { about, notFound, unauthorized } from "./modules/helpers.ts";
import { HOSTNAME, PORT } from "./config.ts";
import { hasToken, login } from "./modules/auth.ts";
import apiUser from "./modules/user.ts";

const PREFIX: string = "/api";
const app: Server = serve({
  hostname: HOSTNAME,
  port: PORT,
});

for await (const req of app) {
  if (req.url === `${PREFIX}/about`) {
    about(req);
  } else if (req.url === `${PREFIX}/auth/login`) {
    login(req);
  } else if (!await hasToken(req)) {
    unauthorized(req);
  } else if (req.url.match(`^${PREFIX}/user/`)) {
    apiUser(req);
  } else {
    notFound(req);
    console.log(req.url);
  }
}
