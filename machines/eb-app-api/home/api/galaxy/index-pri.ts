import { serve } from "https://deno.land/std/http/server.ts";
import { HOSTNAME, PORT_PRIVATE } from "./config.ts";
import {
  methodNotAllowed,
  notFound,
  unauthorized,
} from "./lib/http/response.ts";
import { getIdentityId } from "./lib/pri/kratos.ts";
import domain from "./lib/pri/domain.ts";
import domainInvite from "./lib/pri/domain-invite.ts";
import domainPartner from "./lib/pri/domain-partner.ts";
import domainPartnership from "./lib/pri/domain-partnership.ts";
import hello from "./lib/pri/hello.ts";
import meeting from "./lib/pri/meeting.ts";
import meetingInvite from "./lib/pri/meeting-invite.ts";
import meetingMember from "./lib/pri/meeting-member.ts";
import meetingMembership from "./lib/pri/meeting-membership.ts";
import meetingRequest from "./lib/pri/meeting-request.ts";
import profile from "./lib/pri/profile.ts";
import room from "./lib/pri/room.ts";
import roomInvite from "./lib/pri/room-invite.ts";
import roomPartner from "./lib/pri/room-partner.ts";

const PRE = "/api/pri";

// -----------------------------------------------------------------------------
async function route(
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/hello`) {
    return hello(identityId);
  } else if (path.match(`^${PRE}/domain/invite/`)) {
    return await domainInvite(req, path, identityId);
  } else if (path.match(`^${PRE}/domain/partner/`)) {
    return await domainPartner(req, path, identityId);
  } else if (path.match(`^${PRE}/domain/partnership/`)) {
    return await domainPartnership(req, path, identityId);
  } else if (path.match(`^${PRE}/domain/`)) {
    return await domain(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/invite/`)) {
    return await meetingInvite(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/member/`)) {
    return await meetingMember(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/membership/`)) {
    return await meetingMembership(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/request/`)) {
    return await meetingRequest(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/`)) {
    return await meeting(req, path, identityId);
  } else if (path.match(`^${PRE}/profile/`)) {
    return await profile(req, path, identityId);
  } else if (path.match(`^${PRE}/room/invite`)) {
    return await roomInvite(req, path, identityId);
  } else if (path.match(`^${PRE}/room/partner`)) {
    return await roomPartner(req, path, identityId);
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
