import { fetch, query } from "./common.ts";
import type { Id, RoomPartnership } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoomPartnershipByRoom(
  identityId: string,
  roomId: string,
) {
  const sql = {
    text: `
      SELECT p.id, r.id as room_id, r.name as room_name, d.name as domain_name,
        d.domain_attr->>'url' as domain_url, p.enabled,
        p.created_at, p.updated_at
      FROM room_partner p
        JOIN room r ON p.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
      WHERE p.identity_id = $1
        AND p.room_id = $2`,
    args: [
      identityId,
      roomId,
    ],
  };

  return await fetch(sql) as RoomPartnership[];
}

// -----------------------------------------------------------------------------
export async function addRoomPartnershipByCode(
  identityId: string,
  code: string,
) {
  const sql = {
    text: `
      INSERT INTO room_partner (identity_id, room_id)
      VALUES (
        $1,
        (SELECT room_id
         FROM room_invite
         WHERE code = $2
           AND identity_id != $1
           AND enabled = true
           AND expired_at > now()
        )
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      code,
    ],
  };
  const rows = await fetch(sql) as Id[];

  // disable the invite key if the add action is successful
  const sql1 = {
    text: `
      UPDATE room_invite
      SET
        enabled = false,
        updated_at = now()
      WHERE code = $1`,
    args: [
      code,
    ],
  };
  if (rows[0] !== undefined) await query(sql1);

  return rows;
}

// -----------------------------------------------------------------------------
export async function delRoomPartnership(
  identityId: string,
  partnershipId: string,
) {
  const sql = {
    text: `
      DELETE FROM room_partner
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      partnershipId,
    ],
  };

  return await fetch(sql) as Id[];
}
