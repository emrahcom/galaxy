import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addMembershipByInvite,
  delMembership,
  getMembership,
  updateMembership,
} from "../database/meeting-membership.ts";

const PRE = "/api/pri/meeting/membership";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await getMembership(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function addByInvite(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const profileId = pl.profile_id;
  const inviteCode = pl.invite_code;

  return await addMembershipByInvite(identityId, profileId, inviteCode);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await delMembership(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function update(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;
  const profileId = pl.profile_id;

  return await updateMembership(identityId, membershipId, profileId);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/add/byinvite`) {
    return await wrapper(addByInvite, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    return await wrapper(update, req, identityId);
  } else {
    return notFound();
  }
}
