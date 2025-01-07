import { getLimit, getOffset } from "../database/common.ts";
import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import {
  delIntercomByCode,
  getIntercomAttrByCode,
  listIntercomByKey,
  setStatusIntercomByKey,
} from "../database/intercom.ts";
import { ringCallByKey, ringPhoneByCode } from "../database/intercom-call.ts";

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
  const keyValue = pl.key_value;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listIntercomByKey(keyValue, limit, offset);
}

// -----------------------------------------------------------------------------
async function setAccepted(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await setStatusIntercomByKey(keyValue, intercomId, "accepted");
}

// -----------------------------------------------------------------------------
async function setRejected(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await setStatusIntercomByKey(keyValue, intercomId, "rejected");
}

// -----------------------------------------------------------------------------
async function del(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await delIntercomByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
async function ringCall(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await ringCallByKey(keyValue, intercomId);
}

// -----------------------------------------------------------------------------
async function ringPhone(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await ringPhoneByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/get/attr`) {
    return await wrapper(getAttr, req);
  } else if (path === `${PRE}/list`) {
    return await wrapper(list, req);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req);
  } else if (path === `${PRE}/set/accepted`) {
    return await wrapper(setAccepted, req);
  } else if (path === `${PRE}/set/rejected`) {
    return await wrapper(setRejected, req);
  } else if (path === `${PRE}/call/ring`) {
    return await wrapper(ringCall, req);
  } else if (path === `${PRE}/phone/ring`) {
    return await wrapper(ringPhone, req);
  } else {
    return notFound();
  }
}
