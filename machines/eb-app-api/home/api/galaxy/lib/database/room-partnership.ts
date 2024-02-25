import { fetch, query } from "./common.ts";
import type { Id, RoomPartnership } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoomPartnership(
  identityId: string,
  partnershipId: string,
) {
  const sql = {
    text: `
      SELECT pa.id, r.name as room_name, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        pa.enabled, pa.created_at, pa.updated_at
      FROM room_partner pa
        JOIN room r ON pa.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
      WHERE pa.id = $2
        AND pa.identity_id = $1`,
    args: [
      identityId,
      partnershipId,
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
           AND enabled
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

  // add partner to the contact list
  const sql2 = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        (SELECT identity_id
         FROM room_invite
         WHERE code = $2
        ),
        $1,
        (SELECT name
         FROM profile
         WHERE identity_id = $1
           AND is_default
        )
      )
      ON CONFLICT DO NOTHING`,
    args: [
      identityId,
      code,
    ],
  };
  if (rows[0] !== undefined) await query(sql2);

  // add room owner to the partner's contact list
  const sql3 = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        $1,
        (SELECT identity_id
         FROM room_invite
         WHERE code = $2
        ),
        (SELECT name
         FROM profile
         WHERE identity_id = (SELECT identity_id
                              FROM room_invite
                              WHERE code = $2
                             )
           AND is_default
        )
      )
      ON CONFLICT DO NOTHING`,
    args: [
      identityId,
      code,
    ],
  };
  if (rows[0] !== undefined) await query(sql3);

  // remove the room-partner candidancy if exists
  const sql4 = {
    text: `
      DELETE FROM room_partner_candidate
      WHERE identity_id = $1
        AND room_id = (SELECT room_id
                       FROM room_invite
                       WHERE code = $2
                      )`,
    args: [
      identityId,
      code,
    ],
  };
  if (rows[0] !== undefined) await query(sql4);

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
