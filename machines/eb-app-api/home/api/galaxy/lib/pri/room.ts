import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addRoom,
  delRoom,
  getRoom,
  listRoom,
  updateRoom,
  updateRoomEnabled,
} from "../database/room.ts";

const PRE = "/api/pri/room";

// -----------------------------------------------------------------------------
async function get(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const roomId = pl.id;

  return await getRoom(identityId, roomId);
}

// -----------------------------------------------------------------------------
async function list(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listRoom(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const domainId = pl.domain_id;
  const roomName = pl.name;
  const roomHasSuffix = pl.has_suffix;

  return await addRoom(identityId, domainId, roomName, roomHasSuffix);
}

// -----------------------------------------------------------------------------
async function del(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const roomId = pl.id;

  return await delRoom(identityId, roomId);
}

// -----------------------------------------------------------------------------
async function update(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const roomId = pl.id;
  const domainId = pl.domain_id;
  const roomName = pl.name;
  const roomHasSuffix = pl.has_suffix;

  return await updateRoom(
    identityId,
    roomId,
    domainId,
    roomName,
    roomHasSuffix,
  );
}

// -----------------------------------------------------------------------------
async function enable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const roomId = pl.id;

  return await updateRoomEnabled(identityId, roomId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const roomId = pl.id;

  return await updateRoomEnabled(identityId, roomId, false);
}

// -----------------------------------------------------------------------------
export default function (
  req: Deno.RequestEvent,
  path: string,
  identityId: string,
) {
  if (path === `${PRE}/get`) {
    wrapper(get, req, identityId);
  } else if (path === `${PRE}/list`) {
    wrapper(list, req, identityId);
  } else if (path === `${PRE}/add`) {
    wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    wrapper(update, req, identityId);
  } else if (path === `${PRE}/enable`) {
    wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    wrapper(disable, req, identityId);
  } else {
    notFound(req);
  }
}
