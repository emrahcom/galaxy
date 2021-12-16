import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addMembershipByInvite,
  delMembership,
  getMembership,
  listMembership,
  updateMembership,
} from "../database/membership.ts";

const PRE = "/api/pri/membership";

// -----------------------------------------------------------------------------
async function get(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const membershipId = pl.id;

  return await getMembership(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function list(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listMembership(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function addByInvite(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const profileId = pl.profile_id;
  const inviteCode = pl.invite_code;

  return await addMembershipByInvite(identityId, profileId, inviteCode);
}

// -----------------------------------------------------------------------------
async function del(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const membershipId = pl.id;

  return await delMembership(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function update(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const membershipId = pl.id;
  const profileId = pl.profile_id;

  return await updateMembership(identityId, membershipId, profileId);
}

// -----------------------------------------------------------------------------
export default function (
  req: Deno.RequestEvent,
  path: string,
  identityId: string,
) {
  if (path === `${PRE}/get`) {
    wrapper(get, req, identityId);
  } else if (path === `${PRE}/list`) {
    wrapper(list, req, identityId);
  } else if (path === `${PRE}/add/byinvite`) {
    wrapper(addByInvite, req, identityId);
  } else if (path === `${PRE}/del`) {
    wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    wrapper(update, req, identityId);
  } else {
    notFound(req);
  }
}
