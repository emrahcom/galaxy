import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { callPhoneByCode, getPhoneByCode } from "../database/phone.ts";

const PRE = "/api/pub/phone";

// -----------------------------------------------------------------------------
async function getByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await getPhoneByCode(code);
}

// -----------------------------------------------------------------------------
async function callByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await callPhoneByCode(code);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/get/bycode`) {
    return await wrapper(getByCode, req);
  } else if (path === `${PRE}/call/bycode`) {
    return await wrapper(callByCode, req);
  } else {
    return notFound();
  }
}
