import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addRoomInvite,
  delRoomInvite,
  getRoomInvite,
  getRoomInviteByCode,
  listRoomInviteByRoom,
  updateRoomInviteEnabled,
} from "../database/room-invite.ts";

const PRE = "/api/pri/room/invite";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await getRoomInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function getByCode(req: Request, _identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await getRoomInviteByCode(code);
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

  return await listRoomInviteByRoom(identityId, roomId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const roomId = pl.room_id;
  const name = pl.name;

  return await addRoomInvite(identityId, roomId, name);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await delRoomInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await updateRoomInviteEnabled(identityId, inviteId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await updateRoomInviteEnabled(identityId, inviteId, false);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/get/bycode`) {
    return await wrapper(getByCode, req, identityId);
  } else if (path === `${PRE}/list/byroom`) {
    return await wrapper(listByRoom, req, identityId);
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/enable`) {
    return await wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    return await wrapper(disable, req, identityId);
  } else {
    return notFound();
  }
}
