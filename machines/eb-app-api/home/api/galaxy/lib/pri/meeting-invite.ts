import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addMeetingInvite,
  delMeetingInvite,
  getMeetingInvite,
  getMeetingInviteByCode,
  listMeetingInviteByMeeting,
  updateMeetingInviteEnabled,
} from "../database/meeting-invite.ts";

const PRE = "/api/pri/meeting/invite";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await getMeetingInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function getByCode(req: Request, _identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await getMeetingInviteByCode(code);
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

  return await listMeetingInviteByMeeting(identityId, meetingId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.meeting_id;
  const name = pl.name;
  const inviteType = pl.invite_type;
  const joinAs = pl.join_as;
  const disposable = pl.disposable;

  return await addMeetingInvite(
    identityId,
    meetingId,
    name,
    inviteType,
    joinAs,
    disposable,
  );
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await delMeetingInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await updateMeetingInviteEnabled(identityId, inviteId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await updateMeetingInviteEnabled(identityId, inviteId, false);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/get/bycode`) {
    return await wrapper(getByCode, req, identityId);
  } else if (path === `${PRE}/list/bymeeting`) {
    return await wrapper(listByMeeting, req, identityId);
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/enable`) {
    return await wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    return await wrapper(disable, req, identityId);
  } else {
    return notFound();
  }
}
