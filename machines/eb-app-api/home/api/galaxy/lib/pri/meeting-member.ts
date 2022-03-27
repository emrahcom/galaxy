import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  delMeetingMember,
  getMeetingMember,
  listMeetingMember,
  updateMeetingMemberEnabled,
  updateMeetingMemberJoinAs,
} from "../database/meeting-member.ts";

const PRE = "/api/pri/meeting/member";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await getMeetingMember(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function listByMeeting(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.meeting_id;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listMeetingMember(identityId, meetingId, limit, offset);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await delMeetingMember(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await updateMeetingMemberEnabled(identityId, membershipId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await updateMeetingMemberEnabled(identityId, membershipId, false);
}

// -----------------------------------------------------------------------------
async function setHost(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await updateMeetingMemberJoinAs(identityId, membershipId, "host");
}

// -----------------------------------------------------------------------------
async function setGuest(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await updateMeetingMemberJoinAs(identityId, membershipId, "guest");
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
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/enable`) {
    return await wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    return await wrapper(disable, req, identityId);
  } else if (path === `${PRE}/set/host`) {
    return await wrapper(setHost, req, identityId);
  } else if (path === `${PRE}/set/guest`) {
    return await wrapper(setGuest, req, identityId);
  } else {
    return notFound();
  }
}
