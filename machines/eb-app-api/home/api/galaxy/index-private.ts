import { HOSTNAME, PORT_PRIVATE } from "./config.ts";
import { methodNotAllowed, notFound, unauthorized } from "./lib/helper.ts";
import { getIdentity, hello } from "./lib/private.ts";

const PRE = "/api/pri";

// -----------------------------------------------------------------------------
async function handle(cnn: Deno.Conn) {
  const http = Deno.serveHttp(cnn);

  for await (const req of http) {
    // check method
    if (req.request.method !== `POST`) methodNotAllowed(req);

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
      hello(req, identityId);
    } else {
      notFound(req);
    }
  }
}

// -----------------------------------------------------------------------------
async function main() {
  const server = Deno.listen({
    hostname: HOSTNAME,
    port: PORT_PRIVATE,
  });

  for await (const cnn of server) {
    handle(cnn);
  }
}

// -----------------------------------------------------------------------------
main();
