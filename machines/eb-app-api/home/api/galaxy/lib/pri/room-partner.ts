import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  delRoomPartner,
  getRoomPartner,
  listRoomPartnerByRoom,
  updateRoomPartnerEnabled,
} from "../database/room-partner.ts";

const PRE = "/api/pri/room/partner";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await getRoomPartner(identityId, partnershipId);
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

  return await listRoomPartnerByRoom(identityId, roomId, limit, offset);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await delRoomPartner(identityId, partnershipId);
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await updateRoomPartnerEnabled(identityId, partnershipId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await updateRoomPartnerEnabled(identityId, partnershipId, false);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/list/byroom`) {
    return await wrapper(listByRoom, req, identityId);
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
