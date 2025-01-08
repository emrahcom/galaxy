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
async function getAttrByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await getIntercomAttrByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
async function listByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listIntercomByKey(keyValue, limit, offset);
}

// -----------------------------------------------------------------------------
async function setAcceptedByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await setStatusIntercomByKey(keyValue, intercomId, "accepted");
}

// -----------------------------------------------------------------------------
async function setRejectedByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await setStatusIntercomByKey(keyValue, intercomId, "rejected");
}

// -----------------------------------------------------------------------------
async function delByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await delIntercomByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
async function ringByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await ringCallByKey(keyValue, intercomId);
}

// -----------------------------------------------------------------------------
async function ringByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await ringPhoneByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/get/attr/bycode`) {
    return await wrapper(getAttrByCode, req);
  } else if (path === `${PRE}/list/bykey`) {
    return await wrapper(listByKey, req);
  } else if (path === `${PRE}/del/bycode`) {
    return await wrapper(delByCode, req);
  } else if (path === `${PRE}/set/accepted/bykey`) {
    return await wrapper(setAcceptedByKey, req);
  } else if (path === `${PRE}/set/rejected/bykey`) {
    return await wrapper(setRejectedByKey, req);
  } else if (path === `${PRE}/call/ring/bykey`) {
    return await wrapper(ringByKey, req);
  } else if (path === `${PRE}/phone/ring/bycode`) {
    return await wrapper(ringByCode, req);
  } else {
    return notFound();
  }
}
