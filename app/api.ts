import { serve, Server } from "https://deno.land/std/http/server.ts";
import { about, forbidden, notFound } from "./modules/helpers.ts";
import { isAuthenticated, login } from "./modules/auth.ts";
import apiUser from "./modules/user.ts";

const HOSTNAME: string = "127.0.0.1";
const PORT: number = 8000;
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
  } else if (!isAuthenticated(req)) {
    forbidden(req);
  } else if (req.url.match(`^${PREFIX}/user/`)) {
    apiUser(req);
  } else {
    notFound(req);
    console.log(req.url);
  }
}
