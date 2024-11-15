import { HOSTNAME, PORT_ADMIN } from "./config.ts";
import { methodNotAllowed, notFound } from "./lib/http/response.ts";
import migrate from "./lib/adm/migration.ts";
import doit from "./lib/adm/housekeeping.ts";
import cronjob from "./lib/adm/cronjob.ts";
import hello from "./lib/adm/hello.ts";
import config from "./lib/adm/config-kratos.ts";
import identity from "./lib/adm/identity-kratos.ts";

const PRE = "/api/adm";

// -----------------------------------------------------------------------------
async function migration() {
  try {
    await migrate();

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// -----------------------------------------------------------------------------
async function housekeeping() {
  try {
    await doit();
  } finally {
    // rerun in 10 min
    setTimeout(housekeeping, 10 * 60 * 1000);
  }
}

// -----------------------------------------------------------------------------
async function route(req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/hello`) {
    return hello();
  } else if (path === `${PRE}/config`) {
    return config();
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
async function main() {
  // migrate the database before starting if needed
  const isMigrated = await migration();
  if (!isMigrated) Deno.exit(1);

  // start the housekeeping cycle
  housekeeping();

  // start the cronjob cycle
  cronjob();

  // start API
  Deno.serve({
    hostname: HOSTNAME,
    port: PORT_ADMIN,
  }, handler);
}

// -----------------------------------------------------------------------------
main();
