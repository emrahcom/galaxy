import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  delContact,
  getContact,
  listContact,
  listContactByDomain,
  listContactByMeeting,
  listContactByRoom,
  updateContact,
} from "../database/contact.ts";

const PRE = "/api/pri/contact";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const contactId = pl.id;

  return await getContact(identityId, contactId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listContact(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function listByDomain(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.id;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listContactByDomain(identityId, domainId, limit, offset);
}

// -----------------------------------------------------------------------------
async function listByRoom(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const roomId = pl.id;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listContactByRoom(identityId, roomId, limit, offset);
}

// -----------------------------------------------------------------------------
async function listByMeeting(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const meetingId = pl.id;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listContactByMeeting(identityId, meetingId, limit, offset);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const contactId = pl.id;

  return await delContact(identityId, contactId);
}

// -----------------------------------------------------------------------------
async function update(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const contactId = pl.id;
  const name = pl.name;

  return await updateContact(identityId, contactId, name);
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
  } else if (path === `${PRE}/list/bydomain`) {
    return await wrapper(listByDomain, req, identityId);
  } else if (path === `${PRE}/list/byroom`) {
    return await wrapper(listByRoom, req, identityId);
  } else if (path === `${PRE}/list/bymeeting`) {
    return await wrapper(listByMeeting, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    return await wrapper(update, req, identityId);
  } else {
    return notFound();
  }
}
