import { serve, Server } from "https://deno.land/std/http/server.ts";
import { HOSTNAME, PORT } from "./config.ts";
import { about, notFound, unauthorized } from "./modules/helpers.ts";
import { createToken, hasValidToken } from "./modules/token.ts";
import userApi from "./modules/user.ts";

const PREFIX: string = "/api";
const app: Server = serve({
  hostname: HOSTNAME,
  port: PORT,
});

for await (const req of app) {
  if (req.url === `${PREFIX}/about`) {
    about(req);
  } else if (req.url === `${PREFIX}/token/` && req.method === "POST") {
    await createToken(req);
  } else if (!await hasValidToken(req)) {
    unauthorized(req);
  } else if (req.url.match(`^${PREFIX}/user/`)) {
    userApi(req);
  } else {
    notFound(req);
    console.log(req.url);
  }
}
