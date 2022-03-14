import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  acceptRequest,
  addRequest,
  delRequest,
  dropRequest,
  getRequest,
  listRequest,
  rejectRequest,
  updateRequest,
} from "../database/request.ts";

const PRE = "/api/pri/request";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const requestId = pl.id;

  return await getRequest(identityId, requestId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listRequest(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const profileId = pl.profile_id;
  const meetingId = pl.meeting_id;

  return await addRequest(identityId, profileId, meetingId);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const requestId = pl.id;

  return await delRequest(identityId, requestId);
}

// -----------------------------------------------------------------------------
async function update(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const requestId = pl.id;
  const profileId = pl.profile_id;

  return await updateRequest(identityId, requestId, profileId);
}

// -----------------------------------------------------------------------------
async function accept(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const requestId = pl.id;

  return await acceptRequest(identityId, requestId);
}

// -----------------------------------------------------------------------------
async function reject(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const requestId = pl.id;

  return await rejectRequest(identityId, requestId);
}

// -----------------------------------------------------------------------------
async function drop(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const requestId = pl.id;

  return await dropRequest(identityId, requestId);
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
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    return await wrapper(update, req, identityId);
  } else if (path === `${PRE}/accept`) {
    return await wrapper(accept, req, identityId);
  } else if (path === `${PRE}/reject`) {
    return await wrapper(reject, req, identityId);
  } else if (path === `${PRE}/drop`) {
    return await wrapper(drop, req, identityId);
  } else {
    return notFound();
  }
}
