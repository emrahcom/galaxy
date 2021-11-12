import { HOSTNAME, PORT_PRIVATE } from "./config.ts";
import { getIdentity, notFound, unauthorized } from "./lib/helpers.ts";

const PRE = "/api/private";

// ----------------------------------------------------------------------------
async function handle(cnn: Deno.Conn) {
  const http = Deno.serveHttp(cnn);

  for await (const req of http) {
    // check credential
    const identityId = await getIdentity(req);
    if (!identityId) {
      unauthorized(req);
      continue;
    }

    const url = new URL(req.request.url);
    const path = url.pathname;

    // routing
    if (path === `${PRE}/hello`) {
      req.respondWith(
        new Response(`hello ${identityId}`, {
          status: 200,
        }),
      );
    } else {
      notFound(req);
    }
  }
}

// ----------------------------------------------------------------------------
async function main() {
  const server = Deno.listen({
    hostname: HOSTNAME,
    port: PORT_PRIVATE,
  });

  for await (const cnn of server) {
    handle(cnn);
  }
}

// ----------------------------------------------------------------------------
main();
