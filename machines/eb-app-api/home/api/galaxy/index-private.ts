import { HOSTNAME, PORT_PRIVATE } from "./config.ts";
import {
  methodNotAllowed,
  notFound,
  unauthorized,
} from "./lib/common/http-response.ts";
import { getIdentityId } from "./lib/private/kratos.ts";
import hello from "./lib/private/hello.ts";
import domain from "./lib/private/domain.ts";

const PRE = "/api/pri";

// -----------------------------------------------------------------------------
function route(req: Deno.RequestEvent, path: string, identityId: string) {
  if (path === `${PRE}/hello`) {
    hello(req, identityId);
  } else if (path.match(`^${PRE}/domain/`)) {
    domain(req, path, identityId);
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
      // check credential
      const identityId = await getIdentityId(req);
      if (identityId) {
        const url = new URL(req.request.url);
        const path = url.pathname;

        route(req, path, identityId);
      } else {
        unauthorized(req);
      }
    } else {
      methodNotAllowed(req);
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
