import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { getMeetingScheduleByCode } from "../database/meeting-schedule.ts";

const PRE = "/api/pub/meeting/schedule";

// -----------------------------------------------------------------------------
async function getByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await getMeetingScheduleByCode(code);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/get/bycode`) {
    return await wrapper(getByCode, req);
  } else {
    return notFound();
  }
}
