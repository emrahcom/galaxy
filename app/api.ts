import { serve, Server } from "https://deno.land/std/http/server.ts";
import { Payload } from "https://deno.land/x/djwt/mod.ts";
import { HOSTNAME, PORT } from "./config.ts";
import { about, notFound, unauthorized } from "./modules/helpers.ts";
import { getPayload, sendToken } from "./modules/token.ts";
import { sendAdminToken } from "./modules/admin.ts";
import accountApi from "./modules/account.ts";

const PRE: string = "/api";
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
    } else if (req.url === `${PRE}/admin/` && req.method === "POST") {
      await sendAdminToken(req);
      continue;
    }

    const payload: Payload | undefined = await getPayload(req).catch(() => {
      return undefined;
    });

    if (!payload) unauthorized(req);
    else if (req.url.match(`^${PRE}/account/`)) await accountApi(req, payload);
    else notFound(req);
  }
}

// ----------------------------------------------------------------------------
main();
