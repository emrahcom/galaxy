import { serve, Server } from "https://deno.land/std/http/server.ts";
import { HOSTNAME, PORT } from "./config.ts";
import { about, notFound, unauthorized } from "./api/helpers.ts";
import { getPayload, sendToken, UserPayload } from "./api/token.ts";
import accountApi from "./api/account.ts";

const PRE = "/api";
const app: Server = serve({
  hostname: HOSTNAME,
  port: PORT,
});

// ----------------------------------------------------------------------------
async function main() {
  for await (const req of app) {
    // publicly accessable methods
    if (req.url === `${PRE}/about`) {
      about(req);
      continue;
    } else if (req.url === `${PRE}/token/` && req.method === "POST") {
      sendToken(req);
      continue;
    }

    // validate token
    let pl: UserPayload;
    try {
      pl = await getPayload(req);
      if (!pl.uid) throw new Error("unknown user id");
    } catch (e) {
      unauthorized(req);
      continue;
    }

    // methods which need authentication
    if (req.url.match(`^${PRE}/account/`)) accountApi(req, pl);
    else notFound(req);
  }
}

// ----------------------------------------------------------------------------
main();
