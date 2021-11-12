import { HOSTNAME, PORT_HOOK } from "./config.ts";
import { notFound } from "./lib/helper.ts";
import { addIdentity, hello } from "./lib/hook.ts";

const PRE = "/api/hook";

// ----------------------------------------------------------------------------
async function handle(cnn: Deno.Conn) {
  const http = Deno.serveHttp(cnn);

  for await (const req of http) {
    const url = new URL(req.request.url);
    const path = url.pathname;

    // routing
    if (path === `${PRE}/hello`) {
      hello(req);
    } else if (path === `${PRE}/add-identity`) {
      const pl = await req.request.json();
      const identityId = pl.identity_id;

      addIdentity(req, identityId);
    } else {
      notFound(req);
    }
  }
}

// ----------------------------------------------------------------------------
async function main() {
  const server = Deno.listen({
    hostname: HOSTNAME,
    port: PORT_HOOK,
  });

  for await (const cnn of server) {
    handle(cnn);
  }
}

// ----------------------------------------------------------------------------
main();
