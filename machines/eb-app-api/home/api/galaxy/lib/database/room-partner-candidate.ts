import { fetch } from "./common.ts";
import type { Id, RoomPartnerCandidate } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoomPartnerCandidate(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      SELECT ca.id, ca.room_id, co.name as contact_name,
        pr.name as profile_name, pr.email as profile_email, ca.status,
        ca.created_at, ca.updated_at, ca.expired_at
      FROM room_partner_candidate ca
        LEFT JOIN contact co ON co.identity_id = $1
                                AND co.remote_id = ca.identity_id
        LEFT JOIN profile pr ON ca.identity_id = pr.identity_id
                                AND pr.is_default
      WHERE ca.id = $2
        AND EXISTS (SELECT 1
                    FROM room
                    WHERE id = ca.room_id
                      AND identity_id = $1
                   )`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as RoomPartnerCandidate[];
}

// -----------------------------------------------------------------------------
export async function listRoomPartnerCandidateByRoom(
  identityId: string,
  roomId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT ca.id, ca.room_id, co.name as contact_name,
        pr.name as profile_name, pr.email as profile_email, ca.status,
        ca.created_at, ca.updated_at, ca.expired_at
      FROM room_partner_candidate ca
        LEFT JOIN contact co ON co.identity_id = $1
                                AND co.remote_id = ca.identity_id
        LEFT JOIN profile pr ON ca.identity_id = pr.identity_id
                                AND pr.is_default
      WHERE ca.room_id = $2
        AND EXISTS (SELECT 1
                    FROM room
                    WHERE id = ca.room_id
                      AND identity_id = $1
                   )
      ORDER BY status, contact_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      roomId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as RoomPartnerCandidate[];
}

// -----------------------------------------------------------------------------
export async function addRoomPartnerCandidate(
  identityId: string,
  roomId: string,
  contactId: string,
) {
  const sql = {
    text: `
      INSERT INTO room_partner_candidate (identity_id, room_id)
      VALUES (
        (SELECT remote_id
         FROM contact
         WHERE id = $3
           AND identity_id = $1
        ),
        (SELECT id
         FROM room
         WHERE id = $2
           AND identity_id = $1
        )
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      roomId,
      contactId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delRoomPartnerCandidate(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      DELETE FROM room_partner_candidate
      WHERE id = $2
        AND status = 'pending'
        AND EXISTS (SELECT 1
                    FROM room
                    WHERE id = room_id
                      AND identity_id = $1
                   )
      RETURNING id, now() as at`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as Id[];
}
