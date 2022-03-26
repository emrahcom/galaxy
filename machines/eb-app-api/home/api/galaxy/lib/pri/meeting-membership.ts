import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import {
  addMeetingMembershipByCode,
  delMeetingMembership,
  getMeetingMembershipByMeeting,
  updateMembership,
} from "../database/meeting-membership.ts";

const PRE = "/api/pri/meeting/membership";

// -----------------------------------------------------------------------------
async function getByMeeting(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;

  return await getMeetingMembershipByMeeting(identityId, meetingId);
}

// -----------------------------------------------------------------------------
async function addByCode(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const profileId = pl.profile_id;
  const code = pl.code;

  return await addMeetingMembershipByCode(identityId, profileId, code);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await delMeetingMembership(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function update(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;
  const profileId = pl.profile_id;

  return await updateMeetingMembership(identityId, membershipId, profileId);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get/bymeeting`) {
    return await wrapper(getByMeeting, req, identityId);
  } else if (path === `${PRE}/add/bycode`) {
    return await wrapper(addByCode, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    return await wrapper(update, req, identityId);
  } else {
    return notFound();
  }
}
