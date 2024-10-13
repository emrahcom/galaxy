import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  delIntercom,
  getIntercom,
  listIntercom,
  setStatusIntercom,
} from "../database/intercom.ts";
import { ringCall } from "../database/intercom-call.ts";

const PRE = "/api/pri/intercom";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const intercomId = pl.id;

  return await getIntercom(identityId, intercomId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listIntercom(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const intercomId = pl.id;

  return await delIntercom(identityId, intercomId);
}

// -----------------------------------------------------------------------------
async function setAccepted(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const intercomId = pl.id;

  return await setStatusIntercom(identityId, intercomId, "accepted");
}

// -----------------------------------------------------------------------------
async function setRejected(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const intercomId = pl.id;

  return await setStatusIntercom(identityId, intercomId, "rejected");
}

// -----------------------------------------------------------------------------
async function setSeen(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const intercomId = pl.id;

  return await setStatusIntercom(identityId, intercomId, "seen");
}

// -----------------------------------------------------------------------------
async function ring(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const intercomId = pl.id;

  return await ringCall(identityId, intercomId);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/list`) {
    return await wrapper(list, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/set/accepted`) {
    return await wrapper(setAccepted, req, identityId);
  } else if (path === `${PRE}/set/rejected`) {
    return await wrapper(setRejected, req, identityId);
  } else if (path === `${PRE}/set/seen`) {
    return await wrapper(setSeen, req, identityId);
  } else if (path === `${PRE}/call/ring`) {
    return await wrapper(ring, req, identityId);
  } else {
    return notFound();
  }
}
