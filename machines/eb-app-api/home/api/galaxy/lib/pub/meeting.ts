import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { generateMeetingUrl } from "../common/helper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  getMeetingLinksetByCode,
  getPublicMeeting,
  listPublicMeeting,
} from "../database/meeting.ts";

const PRE = "/api/pub/meeting";

// -----------------------------------------------------------------------------
async function get(req: Request): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;

  return await getPublicMeeting(meetingId);
}

// -----------------------------------------------------------------------------
async function getLinkByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  const linkset = await getMeetingLinksetByCode(code)
    .then((rows) => rows[0]);
  const url = await generateMeetingUrl(linkset);

  const link = [{
    url: url,
  }];

  return link;
}

// -----------------------------------------------------------------------------
async function listEnabled(req: Request): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listPublicMeeting(limit, offset);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req);
  } else if (path === `${PRE}/get/link/bycode`) {
    return await wrapper(getLinkByCode, req);
  } else if (path === `${PRE}/list`) {
    return await wrapper(listEnabled, req);
  } else {
    return notFound();
  }
}
