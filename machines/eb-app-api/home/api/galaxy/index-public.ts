import { HOSTNAME, PORT_PUBLIC } from "./config.ts";
import { notFound } from "./lib/helper.ts";
import { hello } from "./lib/public.ts";

const PRE = "/api/public";

// ----------------------------------------------------------------------------
async function handle(cnn: Deno.Conn) {
  const http = Deno.serveHttp(cnn);

  for await (const req of http) {
    const url = new URL(req.request.url);
    const path = url.pathname;

    // routing
    if (path === `${PRE}/hello`) {
      hello(req);
    } else {
      notFound(req);
    }
  }
}

// ----------------------------------------------------------------------------
async function main() {
  const server = Deno.listen({
    hostname: HOSTNAME,
    port: PORT_PUBLIC,
  });

  for await (const cnn of server) {
    handle(cnn);
  }
}

// ----------------------------------------------------------------------------
main();
