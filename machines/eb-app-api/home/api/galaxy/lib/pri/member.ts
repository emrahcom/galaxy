import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  delMember,
  getMember,
  listMember,
  updateMemberEnabled,
  updateMemberIsHost,
} from "../database/member.ts";

const PRE = "/api/pri/member";

// -----------------------------------------------------------------------------
async function get(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const membershipId = pl.id;

  return await getMember(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function list(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const meetingId = pl.meeting_id;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listMember(identityId, meetingId, limit, offset);
}

// -----------------------------------------------------------------------------
async function del(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const membershipId = pl.id;

  return await delMember(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function enable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const membershipId = pl.id;

  return await updateMemberEnabled(identityId, membershipId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const membershipId = pl.id;

  return await updateMemberEnabled(identityId, membershipId, false);
}

// -----------------------------------------------------------------------------
async function setHost(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const membershipId = pl.id;

  return await updateMemberIsHost(identityId, membershipId, true);
}

// -----------------------------------------------------------------------------
async function setGuest(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const membershipId = pl.id;

  return await updateMemberIsHost(identityId, membershipId, false);
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
  } else if (path === `${PRE}/del`) {
    wrapper(del, req, identityId);
  } else if (path === `${PRE}/enable`) {
    wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    wrapper(disable, req, identityId);
  } else if (path === `${PRE}/set/host`) {
    wrapper(setHost, req, identityId);
  } else if (path === `${PRE}/set/guest`) {
    wrapper(setGuest, req, identityId);
  } else {
    notFound(req);
  }
}
