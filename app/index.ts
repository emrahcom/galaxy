import { serve, Server } from "https://deno.land/std/http/server.ts";
import { HOSTNAME, PORT } from "./config.ts";
import { about, notFound, unauthorized } from "./api/helpers.ts";
import { getPayload, sendToken, UserPayload } from "./api/token.ts";
import { sendAdminToken } from "./api/admin_token.ts";
import accountApi from "./api/account.ts";

const PRE = "/api";
const app: Server = serve({
  hostname: HOSTNAME,
  port: PORT,
});

// ----------------------------------------------------------------------------
async function main() {
  for await (const req of app) {
    if (req.url === `${PRE}/about`) {
      about(req);
      continue;
    } else if (req.url === `${PRE}/token/` && req.method === "POST") {
      await sendToken(req);
      continue;
    } else if (req.url === `${PRE}/admin_token/` && req.method === "POST") {
      await sendAdminToken(req);
      continue;
    }

    const upl: UserPayload | undefined = await getPayload(req).catch(() => {
      return undefined;
    });

    if (!upl) unauthorized(req);
    else if (req.url.match(`^${PRE}/account/`)) await accountApi(req, upl);
    else notFound(req);
  }
}

// ----------------------------------------------------------------------------
main();
