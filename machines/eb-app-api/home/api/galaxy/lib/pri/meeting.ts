import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addMeeting,
  delMeeting,
  getMeeting,
  listMeeting,
  updateMeeting,
  updateMeetingEnabled,
} from "../database/meeting.ts";

const PRE = "/api/pri/meeting";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;

  return await getMeeting(identityId, meetingId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listMeeting(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const profileId = pl.profile_id;
  const roomId = pl.room_id;
  const name = pl.name;
  const info = pl.info;
  const scheduleType = pl.schedule_type;
  const scheduleAttr = pl.schedule_attr;
  const hidden = pl.hidden;
  const restricted = pl.restricted;
  const subscribable = pl.subscribable;

  return await addMeeting(
    identityId,
    profileId,
    roomId,
    name,
    info,
    scheduleType,
    scheduleAttr,
    hidden,
    restricted,
    subscribable,
  );
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;

  return await delMeeting(identityId, meetingId);
}

// -----------------------------------------------------------------------------
async function update(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;
  const profileId = pl.profile_id;
  const roomId = pl.room_id;
  const name = pl.name;
  const info = pl.info;
  const scheduleType = pl.schedule_type;
  const scheduleAttr = pl.schedule_attr;
  const hidden = pl.hidden;
  const restricted = pl.restricted;
  const subscribable = pl.subscribable;

  return await updateMeeting(
    identityId,
    meetingId,
    profileId,
    roomId,
    name,
    info,
    scheduleType,
    scheduleAttr,
    hidden,
    restricted,
    subscribable,
  );
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;

  return await updateMeetingEnabled(identityId, meetingId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;

  return await updateMeetingEnabled(identityId, meetingId, false);
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
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    return await wrapper(update, req, identityId);
  } else if (path === `${PRE}/enable`) {
    return await wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    return await wrapper(disable, req, identityId);
  } else {
    return notFound();
  }
}
