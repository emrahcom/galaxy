import { HOSTNAME, PORT_ADMIN } from "./config.ts";
import { methodNotAllowed, notFound } from "./lib/common/http-response.ts";
import hello from "./lib/adm/hello.ts";
import identity from "./lib/adm/identity.ts";

const PRE = "/api/adm";

// -----------------------------------------------------------------------------
function route(req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/hello`) {
    hello(req);
  } else if (path.match(`^${PRE}/identity/`)) {
    identity(req, path);
  } else {
    notFound(req);
  }
}

// -----------------------------------------------------------------------------
async function handle(cnn: Deno.Conn) {
  const http = Deno.serveHttp(cnn);

  for await (const req of http) {
    // check method
    if (req.request.method === "POST") {
      const url = new URL(req.request.url);
      const path = url.pathname;

      route(req, path);
    } else {
      methodNotAllowed(req);
    }
  }
}

// -----------------------------------------------------------------------------
async function main() {
  const server = Deno.listen({
    hostname: HOSTNAME,
    port: PORT_ADMIN,
  });

  for await (const cnn of server) {
    handle(cnn);
  }
}

// -----------------------------------------------------------------------------
main();
