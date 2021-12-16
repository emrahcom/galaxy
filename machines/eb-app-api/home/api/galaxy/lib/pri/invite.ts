import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addInvite,
  delInvite,
  getInvite,
  getInviteByCode,
  listInvite,
  updateInviteEnabled,
} from "../database/invite.ts";

const PRE = "/api/pri/invite";

// -----------------------------------------------------------------------------
async function get(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const inviteId = pl.id;

  return await getInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function getByCode(req: Deno.RequestEvent, _identityId: string) {
  const pl = await req.request.json();
  const code = pl.code;

  return await getInviteByCode(code);
}

// -----------------------------------------------------------------------------
async function list(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const meetingId = pl.meeting_id;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listInvite(identityId, meetingId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const meetingId = pl.meeting_id;
  const asHost = pl.as_host;

  return await addInvite(identityId, meetingId, asHost);
}

// -----------------------------------------------------------------------------
async function del(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const inviteId = pl.id;

  return await delInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function enable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const inviteId = pl.id;

  return await updateInviteEnabled(identityId, inviteId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const inviteId = pl.id;

  return await updateInviteEnabled(identityId, inviteId, false);
}

// -----------------------------------------------------------------------------
export default function (
  req: Deno.RequestEvent,
  path: string,
  identityId: string,
) {
  if (path === `${PRE}/get`) {
    wrapper(get, req, identityId);
  } else if (path === `${PRE}/get/bycode`) {
    wrapper(getByCode, req, identityId);
  } else if (path === `${PRE}/list`) {
    wrapper(list, req, identityId);
  } else if (path === `${PRE}/add`) {
    wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    wrapper(del, req, identityId);
  } else if (path === `${PRE}/enable`) {
    wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    wrapper(disable, req, identityId);
  } else {
    notFound(req);
  }
}
