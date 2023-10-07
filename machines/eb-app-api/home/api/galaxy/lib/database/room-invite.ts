import { fetch } from "./common.ts";
import type { Id, RoomInvite, RoomInvite111 } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoomInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      SELECT iv.id, iv.name, r.id as room_id, r.name as room_name,
        d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        iv.code, iv.enabled, iv.created_at, iv.updated_at, iv.expired_at
      FROM room_invite iv
        JOIN room r ON iv.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
      WHERE iv.id = $2
        AND iv.identity_id = $1
        AND iv.expired_at > now()`,
    args: [
      identityId,
      inviteId,
    ],
  };

  return await fetch(sql) as RoomInvite[];
}

// -----------------------------------------------------------------------------
export async function getRoomInviteByCode(code: string) {
  const sql = {
    text: `
      SELECT r.name as room_name, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        iv.code
      FROM room_invite iv
        JOIN room r ON iv.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
      WHERE iv.code = $1
        AND iv.enabled
        AND iv.expired_at > now()`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as RoomInvite111[];
}

// -----------------------------------------------------------------------------
export async function listRoomInviteByRoom(
  identityId: string,
  roomId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT iv.id, iv.name, r.id as room_id, r.name as room_name,
        d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        iv.code, iv.enabled, iv.created_at, iv.updated_at, iv.expired_at
      FROM room_invite iv
        JOIN room r ON iv.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
      WHERE iv.identity_id = $1
        AND iv.room_id = $2
        AND iv.expired_at > now()
      ORDER BY iv.updated_at DESC
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      roomId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as RoomInvite[];
}

// -----------------------------------------------------------------------------
export async function addRoomInvite(
  identityId: string,
  roomId: string,
  name: string,
) {
  const sql = {
    text: `
      INSERT INTO room_invite (identity_id, room_id, name)
      VALUES (
        $1,
        (SELECT id
         FROM room
         WHERE id = $2
           AND identity_id = $1
        ),
        $3
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      roomId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delRoomInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      DELETE FROM room_invite
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      inviteId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateRoomInviteEnabled(
  identityId: string,
  inviteId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE room_invite
      SET
        enabled = $3,
        updated_at = now(),
        expired_at = CASE $3::boolean
                       WHEN true THEN now() + interval '3 days'
                       ELSE now() + interval '3 hours'
                     END
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      inviteId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
