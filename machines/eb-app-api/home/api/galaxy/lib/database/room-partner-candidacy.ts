import { fetch, pool } from "./common.ts";
import type { Id, RoomPartnerCandidacy } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoomPartnerCandidacy(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      SELECT ca.id, r.name as room_name, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        ca.status, ca.created_at, ca.updated_at, ca.expired_at
      FROM room_partner_candidate ca
        JOIN room r ON ca.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
      WHERE ca.id = $2
        AND ca.identity_id = $1`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as RoomPartnerCandidacy[];
}

// -----------------------------------------------------------------------------
export async function listRoomPartnerCandidacy(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT ca.id, r.name as room_name, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        ca.status, ca.created_at, ca.updated_at, ca.expired_at
      FROM room_partner_candidate ca
        JOIN room r ON ca.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
      WHERE ca.identity_id = $1
      ORDER BY status, room_name, domain_name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as RoomPartnerCandidacy[];
}

// -----------------------------------------------------------------------------
export async function acceptRoomPartnerCandidacy(
  identityId: string,
  candidacyId: string,
) {
  using client = await pool.connect();
  const trans = client.createTransaction("transaction");
  await trans.begin();

  const sql = {
    text: `
      INSERT INTO room_partner (identity_id, room_id)
      VALUES (
        $1,
        (SELECT room_id
         FROM room_partner_candidate
         WHERE id = $2
           AND identity_id = $1
        )
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  const { rows: rows } = await trans.queryObject(sql);

  // add the inviter (owner) to the invitee's (partner's) contact list
  const sql1 = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        $1,
        (SELECT identity_id
         FROM room
         WHERE id = (SELECT room_id
                     FROM room_partner_candidate
                     WHERE id = $2
                       AND identity_id = $1
                    )
        ),
        (SELECT name
         FROM profile
         WHERE identity_id = (SELECT identity_id
                              FROM room
                              WHERE id = (SELECT room_id
                                          FROM room_partner_candidate
                                          WHERE id = $2
                                            AND identity_id = $1
                                         )
                             )
           AND is_default
        )
      )
      ON CONFLICT DO NOTHING`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  await trans.queryObject(sql1);

  // add the invitee (partner) to the inviter's (owner's) contact list
  const sql2 = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        (SELECT identity_id
         FROM room
         WHERE id = (SELECT room_id
                     FROM room_partner_candidate
                     WHERE id = $2
                       AND identity_id = $1
                    )
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
      candidacyId,
    ],
  };
  await trans.queryObject(sql2);

  // remove the room-partner candidancy if the add action is successful
  const sql3 = {
    text: `
        DELETE FROM room_partner_candidate
        WHERE id = $2
          AND identity_id = $1`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  await trans.queryObject(sql3);

  await trans.commit();

  return rows as Id[];
}

// -----------------------------------------------------------------------------
export async function rejectRoomPartnerCandidacy(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      UPDATE room_partner_candidate
      SET
        status = 'rejected',
        updated_at = now(),
        expired_at = now() + interval '7 days'
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as Id[];
}
