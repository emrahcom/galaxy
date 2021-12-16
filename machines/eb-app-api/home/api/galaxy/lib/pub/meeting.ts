import { notFound, responsePub } from "../http/response.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  getPublicMeeting,
  listEnabledPublicMeeting,
} from "../database/meeting.ts";

const PRE = "/api/pub/meeting";

// -----------------------------------------------------------------------------
async function get(req: Deno.RequestEvent) {
  const pl = await req.request.json();
  const meetingId = pl.id;

  return await getPublicMeeting(meetingId);
}

// -----------------------------------------------------------------------------
async function listEnabled(req: Deno.RequestEvent) {
  const pl = await req.request.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listEnabledPublicMeeting(limit, offset);
}

// -----------------------------------------------------------------------------
export default function (req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/get`) {
    responsePub(get, req);
  } else if (path === `${PRE}/list/enabled`) {
    responsePub(listEnabled, req);
  } else {
    notFound(req);
  }
}
