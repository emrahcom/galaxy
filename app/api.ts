import { serve } from "https://deno.land/std/http/server.ts";
import { about, notFound } from "./modules/helper.ts";

const HOSTNAME = "127.0.0.1";
const PORT = 8000;

const app = serve({
  hostname: HOSTNAME,
  port: PORT,
});

for await (const req of app) {
  if (req.url === "/about") {
    about(req);
  } else if (req.url === "/user/") {
    console.log("user");
  } else {
    notFound(req);
  }
}
