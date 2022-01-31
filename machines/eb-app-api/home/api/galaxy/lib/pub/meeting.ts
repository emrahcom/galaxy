import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  getPublicMeeting,
  listEnabledPublicMeeting,
} from "../database/meeting.ts";

const PRE = "/api/pub/meeting";

// -----------------------------------------------------------------------------
async function get(req: Request): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;

  return await getPublicMeeting(meetingId);
}

// -----------------------------------------------------------------------------
async function listEnabled(req: Request): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listEnabledPublicMeeting(limit, offset);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req);
  } else if (path === `${PRE}/list/enabled`) {
    return await wrapper(listEnabled, req);
  } else {
    return notFound();
  }
}
