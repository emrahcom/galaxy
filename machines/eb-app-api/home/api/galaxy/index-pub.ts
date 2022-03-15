import { serve } from "https://deno.land/std/http/server.ts";
import { HOSTNAME, PORT_PUBLIC } from "./config.ts";
import { methodNotAllowed, notFound } from "./lib/http/response.ts";
import hello from "./lib/pub/hello.ts";
import meeting from "./lib/pub/meeting.ts";

const PRE = "/api/pub";

// -----------------------------------------------------------------------------
async function route(req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/hello`) {
    return hello();
  } else if (path.match(`^${PRE}/meeting/`)) {
    return await meeting(req, path);
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
    port: PORT_PUBLIC,
  });
}

// -----------------------------------------------------------------------------
main();
