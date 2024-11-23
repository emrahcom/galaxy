import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { getPhoneByCode } from "../database/phone.ts";

const PRE = "/api/pub/phone";

// -----------------------------------------------------------------------------
async function getByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await getPhoneByCode(meetingId);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/get/bycode`) {
    return await wrapper(getByCode, req);
  } else {
    return notFound();
  }
}
