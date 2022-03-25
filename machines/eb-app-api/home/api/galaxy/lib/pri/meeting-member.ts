import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  delMember,
  getMember,
  listMember,
  updateMemberEnabled,
  updateMemberJoinAs,
} from "../database/meeting-member.ts";

const PRE = "/api/pri/meeting/member";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await getMember(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.meeting_id;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listMember(identityId, meetingId, limit, offset);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await delMember(identityId, membershipId);
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await updateMemberEnabled(identityId, membershipId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await updateMemberEnabled(identityId, membershipId, false);
}

// -----------------------------------------------------------------------------
async function setHost(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await updateMemberJoinAs(identityId, membershipId, "host");
}

// -----------------------------------------------------------------------------
async function setGuest(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const membershipId = pl.id;

  return await updateMemberJoinAs(identityId, membershipId, "guest");
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/list`) {
    return await wrapper(list, req, identityId);
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
