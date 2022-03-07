import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { createLink } from "../common/helper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import { getDefaultProfile } from "../database/profile.ts";
import {
  addRoom,
  delRoom,
  getRoom,
  getRoomLink,
  listRoom,
  updateRoom,
  updateRoomEnabled,
} from "../database/room.ts";

const PRE = "/api/pri/room";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const roomId = pl.id;

  return await getRoom(identityId, roomId);
}

// -----------------------------------------------------------------------------
async function getLink(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const roomId = pl.id;

  const roomLink = await getRoomLink(identityId, roomId)
    .then((rows) => rows[0]);
  const profile = await getDefaultProfile(identityId)
    .then((rows) => rows[0]);
  const link = await createLink(roomLink, profile);

  const res = [{
    link: link,
  }];

  return res;
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listRoom(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.domain_id;
  const name = pl.name;
  const hasSuffix = pl.has_suffix;

  return await addRoom(identityId, domainId, name, hasSuffix);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const roomId = pl.id;

  return await delRoom(identityId, roomId);
}

// -----------------------------------------------------------------------------
async function update(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const roomId = pl.id;
  const domainId = pl.domain_id;
  const name = pl.name;
  const hasSuffix = pl.has_suffix;

  return await updateRoom(
    identityId,
    roomId,
    domainId,
    name,
    hasSuffix,
  );
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const roomId = pl.id;

  return await updateRoomEnabled(identityId, roomId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const roomId = pl.id;

  return await updateRoomEnabled(identityId, roomId, false);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/get/link`) {
    return await wrapper(getLink, req, identityId);
  } else if (path === `${PRE}/list`) {
    return await wrapper(list, req, identityId);
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    return await wrapper(update, req, identityId);
  } else if (path === `${PRE}/enable`) {
    return await wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    return await wrapper(disable, req, identityId);
  } else {
    return notFound();
  }
}
