import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import {
  addMeetingMembershipByCode,
  checkMeetingMembershipByCode,
  delMeetingMembership,
  getMeetingMembership,
  updateMeetingMembership,
} from "../database/meeting-membership.ts";

const PRE = "/api/pri/meeting/membership";

// -----------------------------------------------------------------------------
async function get(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await getMeetingMembership(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function checkByCode(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await checkMeetingMembershipByCode(identityId, code);
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
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/check/bycode`) {
    return await wrapper(checkByCode, req, identityId);
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
