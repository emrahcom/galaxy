import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  acceptRoomPartnerCandidacy,
  getRoomPartnerCandidacy,
  listRoomPartnerCandidacy,
  rejectRoomPartnerCandidacy,
} from "../database/room-partner-candidacy.ts";

const PRE = "/api/pri/room/partner/candidacy";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await getRoomPartnerCandidacy(identityId, candidacyId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listRoomPartnerCandidacy(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function accept(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await acceptRoomPartnerCandidacy(identityId, candidacyId);
}

// -----------------------------------------------------------------------------
async function reject(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await rejectRoomPartnerCandidacy(identityId, candidacyId);
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
  } else if (path === `${PRE}/accept`) {
    return await wrapper(accept, req, identityId);
  } else if (path === `${PRE}/reject`) {
    return await wrapper(reject, req, identityId);
  } else {
    return notFound();
  }
}
