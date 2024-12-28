import { getLimit, getOffset } from "../database/common.ts";
import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import {
  delIntercomByCode,
  getIntercomAttrByCode,
  listIntercomByCode,
} from "../database/intercom.ts";
import { ringPhone } from "../database/intercom-call.ts";

const PRE = "/api/pub/intercom";

// -----------------------------------------------------------------------------
async function getAttr(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await getIntercomAttrByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
async function list(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listIntercomByCode(code, limit, offset);
}

// -----------------------------------------------------------------------------
async function del(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await delIntercomByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
async function ring(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await ringPhone(code, intercomId);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/get/attr`) {
    return await wrapper(getAttr, req);
  } else if (path === `${PRE}/list`) {
    return await wrapper(list, req);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req);
  } else if (path === `${PRE}/phone/ring`) {
    return await wrapper(ring, req);
  } else {
    return notFound();
  }
}
