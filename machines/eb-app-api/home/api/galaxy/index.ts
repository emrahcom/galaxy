import { serve, Server } from "https://deno.land/std/http/server.ts";
import { HOSTNAME, PORT } from "./config.ts";

const PRE = "/api";
const app: Server = serve({
  hostname: HOSTNAME,
  port: PORT,
});

// ----------------------------------------------------------------------------
async function main() {
  for await (const req of app) {
    if (req.url === `${PRE}/about`) {
      continue;
    } else if (req.url === `${PRE}/token/` && req.method === "POST") {
      continue;
    }
}

// ----------------------------------------------------------------------------
main();
