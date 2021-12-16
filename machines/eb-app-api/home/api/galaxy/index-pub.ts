import { HOSTNAME, PORT_PUBLIC } from "./config.ts";
import { methodNotAllowed, notFound } from "./lib/http/response.ts";
import domain from "./lib/pub/domain.ts";
import hello from "./lib/pub/hello.ts";
import meeting from "./lib/pub/meeting.ts";

const PRE = "/api/pub";

// -----------------------------------------------------------------------------
function route(req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/hello`) {
    hello(req);
  } else if (path.match(`^${PRE}/domain/`)) {
    domain(req, path);
  } else if (path.match(`^${PRE}/meeting/`)) {
    meeting(req, path);
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
    port: PORT_PUBLIC,
  });

  for await (const cnn of server) {
    handle(cnn);
  }
}

// -----------------------------------------------------------------------------
main();
