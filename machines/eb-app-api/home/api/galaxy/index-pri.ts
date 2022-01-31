import { serve } from "https://deno.land/std/http/server.ts";
import { HOSTNAME, PORT_PRIVATE } from "./config.ts";
import {
  methodNotAllowed,
  notFound,
  unauthorized,
} from "./lib/http/response.ts";
import { getIdentityId } from "./lib/pri/kratos.ts";
import domain from "./lib/pri/domain.ts";
import hello from "./lib/pri/hello.ts";
import invite from "./lib/pri/invite.ts";
import meeting from "./lib/pri/meeting.ts";
import member from "./lib/pri/member.ts";
import membership from "./lib/pri/membership.ts";
import profile from "./lib/pri/profile.ts";
import request from "./lib/pri/request.ts";
import room from "./lib/pri/room.ts";

const PRE = "/api/pri";

// -----------------------------------------------------------------------------
async function route(
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/hello`) {
    return hello(identityId);
  } else if (path.match(`^${PRE}/domain/`)) {
    return await domain(req, path, identityId);
  } else if (path.match(`^${PRE}/invite/`)) {
    return await invite(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/`)) {
    return await meeting(req, path, identityId);
  } else if (path.match(`^${PRE}/member/`)) {
    return await member(req, path, identityId);
  } else if (path.match(`^${PRE}/membership/`)) {
    return await membership(req, path, identityId);
  } else if (path.match(`^${PRE}/profile/`)) {
    return await profile(req, path, identityId);
  } else if (path.match(`^${PRE}/request/`)) {
    return await request(req, path, identityId);
  } else if (path.match(`^${PRE}/room/`)) {
    return await room(req, path, identityId);
  } else {
    return notFound();
  }
}

// -----------------------------------------------------------------------------
async function handler(req: Request): Promise<Response> {
  // check method
  if (req.method === "POST") {
    // check credential
    const identityId = await getIdentityId(req);
    if (identityId) {
      const url = new URL(req.url);
      const path = url.pathname;

      return await route(req, path, identityId);
    } else {
      return unauthorized();
    }
  } else {
    return methodNotAllowed();
  }
}

// -----------------------------------------------------------------------------
function main() {
  serve(handler, {
    hostname: HOSTNAME,
    port: PORT_PRIVATE,
  });
}

// -----------------------------------------------------------------------------
main();
