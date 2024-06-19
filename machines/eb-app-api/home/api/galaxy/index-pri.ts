import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { DB_VERSION, HOSTNAME, PORT_PRIVATE } from "./config.ts";
import {
  methodNotAllowed,
  notFound,
  unauthorized,
} from "./lib/http/response.ts";
import { getIdentityId } from "./lib/pri/kratos.ts";
import { getVersion } from "./lib/database/common.ts";
import calendar from "./lib/pri/calendar.ts";
import contact from "./lib/pri/contact.ts";
import domain from "./lib/pri/domain.ts";
import domainInvite from "./lib/pri/domain-invite.ts";
import domainPartner from "./lib/pri/domain-partner.ts";
import domainPartnerCandidacy from "./lib/pri/domain-partner-candidacy.ts";
import domainPartnerCandidate from "./lib/pri/domain-partner-candidate.ts";
import domainPartnership from "./lib/pri/domain-partnership.ts";
import hello from "./lib/pri/hello.ts";
import meeting from "./lib/pri/meeting.ts";
import meetingInvite from "./lib/pri/meeting-invite.ts";
import meetingMember from "./lib/pri/meeting-member.ts";
import meetingMemberCandidacy from "./lib/pri/meeting-member-candidacy.ts";
import meetingMemberCandidate from "./lib/pri/meeting-member-candidate.ts";
import meetingMembership from "./lib/pri/meeting-membership.ts";
import meetingRequest from "./lib/pri/meeting-request.ts";
import meetingSchedule from "./lib/pri/meeting-schedule.ts";
import profile from "./lib/pri/profile.ts";
import room from "./lib/pri/room.ts";
import roomInvite from "./lib/pri/room-invite.ts";
import roomPartner from "./lib/pri/room-partner.ts";
import roomPartnerCandidacy from "./lib/pri/room-partner-candidacy.ts";
import roomPartnerCandidate from "./lib/pri/room-partner-candidate.ts";
import roomPartnership from "./lib/pri/room-partnership.ts";

const PRE = "/api/pri";

// -----------------------------------------------------------------------------
async function route(
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/hello`) {
    return hello(identityId);
  } else if (path.match(`^${PRE}/calendar/`)) {
    return await calendar(req, path, identityId);
  } else if (path.match(`^${PRE}/contact/`)) {
    return await contact(req, path, identityId);
  } else if (path.match(`^${PRE}/domain/invite/`)) {
    return await domainInvite(req, path, identityId);
  } else if (path.match(`^${PRE}/domain/partner/candidacy/`)) {
    return await domainPartnerCandidacy(req, path, identityId);
  } else if (path.match(`^${PRE}/domain/partner/candidate/`)) {
    return await domainPartnerCandidate(req, path, identityId);
  } else if (path.match(`^${PRE}/domain/partner/`)) {
    return await domainPartner(req, path, identityId);
  } else if (path.match(`^${PRE}/domain/partnership/`)) {
    return await domainPartnership(req, path, identityId);
  } else if (path.match(`^${PRE}/domain/`)) {
    return await domain(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/invite/`)) {
    return await meetingInvite(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/member/candidacy/`)) {
    return await meetingMemberCandidacy(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/member/candidate/`)) {
    return await meetingMemberCandidate(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/member/`)) {
    return await meetingMember(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/membership/`)) {
    return await meetingMembership(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/request/`)) {
    return await meetingRequest(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/schedule/`)) {
    return await meetingSchedule(req, path, identityId);
  } else if (path.match(`^${PRE}/meeting/`)) {
    return await meeting(req, path, identityId);
  } else if (path.match(`^${PRE}/profile/`)) {
    return await profile(req, path, identityId);
  } else if (path.match(`^${PRE}/room/invite/`)) {
    return await roomInvite(req, path, identityId);
  } else if (path.match(`^${PRE}/room/partner/candidacy/`)) {
    return await roomPartnerCandidacy(req, path, identityId);
  } else if (path.match(`^${PRE}/room/partner/candidate/`)) {
    return await roomPartnerCandidate(req, path, identityId);
  } else if (path.match(`^${PRE}/room/partner/`)) {
    return await roomPartner(req, path, identityId);
  } else if (path.match(`^${PRE}/room/partnership/`)) {
    return await roomPartnership(req, path, identityId);
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
    const identityId = await getIdentityId(req);

    if (identityId && typeof identityId === "string") {
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
async function main() {
  const version = await getVersion();

  // dont start if the database version doesn't match
  if (DB_VERSION !== version) {
    console.error("Unsupported database version");
    Deno.exit(1);
  }

  serve(handler, {
    hostname: HOSTNAME,
    port: PORT_PRIVATE,
  });
}

// -----------------------------------------------------------------------------
main();
