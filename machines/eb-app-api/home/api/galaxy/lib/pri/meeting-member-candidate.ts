import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import { mailToMeetingMemberCandidate } from "../common/mail.ts";
import {
  addMeetingMemberCandidate,
  delMeetingMemberCandidate,
  getMeetingMemberCandidate,
  listMeetingMemberCandidateByMeeting,
} from "../database/meeting-member-candidate.ts";

const PRE = "/api/pri/meeting/member/candidate";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await getMeetingMemberCandidate(identityId, candidacyId);
}

// -----------------------------------------------------------------------------
async function listByMeeting(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listMeetingMemberCandidateByMeeting(
    identityId,
    meetingId,
    limit,
    offset,
  );
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.meeting_id;
  const contactId = pl.contact_id;
  const joinAs = pl.join_as;

  const rows = await addMeetingMemberCandidate(
    identityId,
    meetingId,
    contactId,
    joinAs,
  );

  const candidacyId = rows[0]?.id;
  if (candidacyId) {
    // dont wait for the mailer
    mailToMeetingMemberCandidate(identityId, contactId, candidacyId);
  }

  return rows;
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await delMeetingMemberCandidate(identityId, candidacyId);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/list/bymeeting`) {
    return await wrapper(listByMeeting, req, identityId);
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else {
    return notFound();
  }
}
