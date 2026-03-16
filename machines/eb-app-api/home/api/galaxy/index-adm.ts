import { HOSTNAME, PORT_ADMIN } from "./config.ts";
import { methodNotAllowed, notFound } from "./lib/http/response.ts";
import { Timers } from "./lib/adm/types.ts";
import migrate from "./lib/adm/migration.ts";
import doit from "./lib/adm/housekeeping.ts";
import cronjob from "./lib/adm/cronjob.ts";
import hello from "./lib/adm/hello.ts";
import config from "./lib/adm/config-kratos.ts";
import identity from "./lib/adm/identity-kratos.ts";

const PRE = "/api/adm";

const timers: Timers = {
  housekeeping: 0,
  cronjobRemindMeetingSession: 0,
};

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
async function housekeeping(t: Timers, signal: AbortSignal) {
  if (signal.aborted) return;

  try {
    await doit();
  } catch {
    // do nothing
  }

  if (signal.aborted) return;

  // rerun in 10 min
  t.housekeeping = setTimeout(() => housekeeping(t, signal), 10 * 60 * 1000);
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
  // ensure database schema is up-to-date before starting
  const isMigrated = await migration();
  if (!isMigrated) Deno.exit(1);

  const controller = new AbortController();
  const shutdown = () => {
    controller.abort();
    clearTimeout(timers.housekeeping);
    clearTimeout(timers.cronjobRemindMeetingSession);
  };
  Deno.addSignalListener("SIGINT", shutdown);
  Deno.addSignalListener("SIGTERM", shutdown);

  try {
    // start the housekeeping cycle
    housekeeping(timers, controller.signal);

    // start the cronjob cycle
    cronjob(timers, controller.signal);

    // start the API server
    const server = Deno.serve({
      hostname: HOSTNAME,
      port: PORT_ADMIN,
      signal: controller.signal,
    }, handler);

    // wait the server until the clean shutdown.
    await server.finished;
  } finally {
    Deno.removeSignalListener("SIGINT", shutdown);
    Deno.removeSignalListener("SIGTERM", shutdown);
  }
}

// -----------------------------------------------------------------------------
main();
