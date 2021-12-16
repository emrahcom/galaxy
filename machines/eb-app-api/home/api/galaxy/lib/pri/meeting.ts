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
async function get(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const meetingId = pl.id;

  return await getMeeting(identityId, meetingId);
}

// -----------------------------------------------------------------------------
async function list(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listMeeting(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const meetingProfileId = pl.profile_id;
  const meetingRoomId = pl.room_id;
  const meetingName = pl.name;
  const meetingInfo = pl.info;
  const meetingScheduleType = pl.schedule_type;
  const meetingScheduleAttr = pl.schedule_attr;
  const meetingHidden = pl.hidden;
  const meetingRestricted = pl.restricted;

  return await addMeeting(
    identityId,
    meetingProfileId,
    meetingRoomId,
    meetingName,
    meetingInfo,
    meetingScheduleType,
    meetingScheduleAttr,
    meetingHidden,
    meetingRestricted,
  );
}

// -----------------------------------------------------------------------------
async function del(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const meetingId = pl.id;

  return await delMeeting(identityId, meetingId);
}

// -----------------------------------------------------------------------------
async function update(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const meetingId = pl.id;
  const meetingProfileId = pl.profile_id;
  const meetingRoomId = pl.room_id;
  const meetingName = pl.name;
  const meetingInfo = pl.info;
  const meetingScheduleType = pl.schedule_type;
  const meetingScheduleAttr = pl.schedule_attr;
  const meetingHidden = pl.hidden;
  const meetingRestricted = pl.restricted;

  return await updateMeeting(
    identityId,
    meetingId,
    meetingProfileId,
    meetingRoomId,
    meetingName,
    meetingInfo,
    meetingScheduleType,
    meetingScheduleAttr,
    meetingHidden,
    meetingRestricted,
  );
}

// -----------------------------------------------------------------------------
async function enable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const meetingId = pl.id;

  return await updateMeetingEnabled(identityId, meetingId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const meetingId = pl.id;

  return await updateMeetingEnabled(identityId, meetingId, false);
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
  } else if (path === `${PRE}/add`) {
    wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    wrapper(update, req, identityId);
  } else if (path === `${PRE}/enable`) {
    wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    wrapper(disable, req, identityId);
  } else {
    notFound(req);
  }
}
