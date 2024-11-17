import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import { mailToRoomPartnerCandidate } from "../common/mail.ts";
import {
  addRoomPartnerCandidate,
  delRoomPartnerCandidate,
  getRoomPartnerCandidate,
  listRoomPartnerCandidateByRoom,
} from "../database/room-partner-candidate.ts";

const PRE = "/api/pri/room/partner/candidate";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await getRoomPartnerCandidate(identityId, candidacyId);
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

  return await listRoomPartnerCandidateByRoom(
    identityId,
    roomId,
    limit,
    offset,
  );
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const roomId = pl.room_id;
  const contactId = pl.contact_id;

  const rows = await addRoomPartnerCandidate(identityId, roomId, contactId);

  const candidacyId = rows[0]?.id;
  if (candidacyId) {
    // dont wait for the mailer
    mailToRoomPartnerCandidate(identityId, contactId, candidacyId);
  }

  return rows;
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await delRoomPartnerCandidate(identityId, candidacyId);
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
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else {
    return notFound();
  }
}
