import { Server, serve } from "https://deno.land/std/http/server.ts";
import { about, notFound, forbidden } from "./modules/helpers.ts";
import { isAuthenticated } from "./modules/auth.ts";
import apiUser from "./modules/user.ts";

const HOSTNAME: string = "127.0.0.1";
const PORT: number = 8000;

const app: Server = serve({
  hostname: HOSTNAME,
  port: PORT,
});

for await (const req of app) {
  if (req.url === "/about") {
    about(req);
  } else if (!isAuthenticated(req)) {
    forbidden(req);
  } else if (req.url === "/user/") {
    apiUser(req);
  } else {
    notFound(req);
  }
}
