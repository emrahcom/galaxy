import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import {
  addRoomPartnershipByCode,
  checkRoomPartnershipByCode,
  delRoomPartnership,
  getRoomPartnership,
} from "../database/room-partnership.ts";

const PRE = "/api/pri/room/partnership";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await getRoomPartnership(identityId, partnershipId);
}

// -----------------------------------------------------------------------------
async function checkByCode(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await checkRoomPartnershipByCode(identityId, code);
}

// -----------------------------------------------------------------------------
async function addByCode(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await addRoomPartnershipByCode(identityId, code);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await delRoomPartnership(identityId, partnershipId);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/check/bycode`) {
    return await wrapper(checkByCode, req, identityId);
  } else if (path === `${PRE}/add/bycode`) {
    return await wrapper(addByCode, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else {
    return notFound();
  }
}
