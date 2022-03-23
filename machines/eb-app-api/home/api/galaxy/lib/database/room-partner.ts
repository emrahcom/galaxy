import { fetch } from "./common.ts";
import type { Id, RoomPartner } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoomPartner(
  identityId: string,
  partnershipId: string,
) {
  const sql = {
    text: `
      SELECT pa.id, pa.room_id, pr.name as profile_name,
        pr.email as profile_email, pa.enabled, pa.created_at, pa.updated_at
      FROM room_partner pa
        LEFT JOIN profile pr ON pa.identity_id = pr.identity_id
                                AND pr.is_default = true
      WHERE pa.id = $2
        AND EXISTS (SELECT 1
                    FROM room
                    WHERE id = pa.room_id
                      AND identity_id = $1
                   )`,
    args: [
      identityId,
      partnershipId,
    ],
  };

  return await fetch(sql) as RoomPartner[];
}

// -----------------------------------------------------------------------------
export async function listRoomPartnerByRoom(
  identityId: string,
  roomId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT pa.id, pa.room_id, pr.name as profile_name,
        pr.email as profile_email, pa.enabled, pa.created_at, pa.updated_at
      FROM room_partner pa
        LEFT JOIN profile pr ON pa.identity_id = pr.identity_id
                                AND pr.is_default = true
      WHERE pa.room_id = $2
        AND EXISTS (SELECT 1
                    FROM room
                    WHERE id = pa.room_id
                      AND identity_id = $1
                   )
      ORDER BY profile_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      roomId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as RoomPartner[];
}

// -----------------------------------------------------------------------------
export async function delRoomPartner(
  identityId: string,
  partnershipId: string,
) {
  const sql = {
    text: `
      DELETE FROM room_partner
      WHERE id = $2
        AND room_id IN (SELECT id
                        FROM room
                        WHERE identity_id = $1
                       )
      RETURNING id, now() as at`,
    args: [
      identityId,
      partnershipId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateRoomPartnerEnabled(
  identityId: string,
  partnershipId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE room_partner
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND room_id IN (SELECT id
                        FROM room
                        WHERE identity_id = $1
                       )
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      partnershipId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
