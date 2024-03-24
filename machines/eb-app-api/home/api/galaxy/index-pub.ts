import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { DB_VERSION, HOSTNAME, PORT_PUBLIC } from "./config.ts";
import { methodNotAllowed, notFound } from "./lib/http/response.ts";
import { getVersion } from "./lib/database/common.ts";
import hello from "./lib/pub/hello.ts";
import meeting from "./lib/pub/meeting.ts";
import meetingSchedule from "./lib/pub/meeting-schedule.ts";

const PRE = "/api/pub";

// -----------------------------------------------------------------------------
async function route(req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/hello`) {
    return hello();
  } else if (path.match(`^${PRE}/meeting/schedule`)) {
    return await meetingSchedule(req, path);
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
async function main() {
  const version = await getVersion();

  // dont start if the database version doesn't match
  if (DB_VERSION !== version) {
    console.error("Unsupported database version");
    Deno.exit(1);
  }

  serve(handler, {
    hostname: HOSTNAME,
    port: PORT_PUBLIC,
  });
}

// -----------------------------------------------------------------------------
main();
