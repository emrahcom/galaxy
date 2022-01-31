import { serve } from "https://deno.land/std/http/server.ts";
import { HOSTNAME, PORT_ADMIN } from "./config.ts";
import { methodNotAllowed, notFound } from "./lib/http/response.ts";
import hello from "./lib/adm/hello.ts";
import identity from "./lib/adm/identity.ts";

const PRE = "/api/adm";

// -----------------------------------------------------------------------------
async function route(req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/hello`) {
    return hello();
  } else if (path.match(`^${PRE}/identity/`)) {
    return await identity(req, path);
  } else {
    return notFound();
  }
}

// -----------------------------------------------------------------------------
async function handler(req: Request): Promise<Response> {
  // check method
  if (req.method === "POST") {
    const url = new URL(req.url);
    const path = url.pathname;

    return await route(req, path);
  } else {
    return methodNotAllowed();
  }
}

// -----------------------------------------------------------------------------
function main() {
  serve(handler, {
    hostname: HOSTNAME,
    port: PORT_ADMIN,
  });
}

// -----------------------------------------------------------------------------
main();
