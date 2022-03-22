import { fetch } from "./common.ts";
import type { Id, Room, RoomLinkSet, RoomReduced } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoom(identityId: string, roomId: string) {
  const sql = {
    text: `
      SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
        d.domain_attr->>'url' as domain_url, d.enabled as domain_enabled,
        r.has_suffix, r.enabled, r.created_at, r.updated_at, r.accessed_at
      FROM room r
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
      WHERE r.id = $2
        AND r.identity_id = $1
        AND r.ephemeral = false`,
    args: [
      identityId,
      roomId,
    ],
  };

  return await fetch(sql) as Room[];
}

// -----------------------------------------------------------------------------
export async function getRoomLinkSet(identityId: string, roomId: string) {
  await updateRoomSuffix(roomId);
  await updateRoomAccessTime(roomId);

  const sql = {
    text: `
      SELECT r.name, r.has_suffix, r.suffix, d.auth_type, d.domain_attr
      FROM room r
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE r.id = $2
        AND r.identity_id = $1
        AND r.ephemeral = false
        AND (d.identity_id = $1
             OR (d.enabled = true AND d.public = true)
             OR (d.enabled = true AND i.enabled = true
                 AND EXISTS (SELECT 1
                             FROM domain_partner
                             WHERE identity_id = $1
                               AND domain_id = d.id
                               AND enabled = true
                            )
                )
            )

      UNION

      SELECT r.name, r.has_suffix, r.suffix, d.auth_type, d.domain_attr
      FROM room_partner p
        JOIN room r ON p.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
      WHERE p.identity_id = $1
        AND p.room_id = $2
        AND p.enabled = true
        AND r.ephemeral = false
        AND r.enabled = true
        AND d.enabled = true
        AND i1.enabled = true
        AND i2.enabled = true
        AND (d.identity_id = $1
             OR d.public = true
             OR EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = i2.id
                          AND domain_id = d.id
                          AND enabled = true
                       )
            )`,
    args: [
      identityId,
      roomId,
    ],
  };

  return await fetch(sql) as RoomLinkSet[];
}

// -----------------------------------------------------------------------------
export async function listRoom(
  identityId: string,
  limit: number,
  offset: number,
) {
  // updated_at is used by UI to pick the newest one
  const sql = {
    text: `
      SELECT r.id, r.name, d.name as domain_name,
        d.domain_attr->>'url' as domain_url, r.enabled,
        (d.enabled AND i.enabled
         AND CASE d.identity_id
             WHEN $1 THEN true
             ELSE CASE d.public
                  WHEN true THEN true
                  ELSE (SELECT enabled
                        FROM domain_partner
                        WHERE identity_id = $1
                          AND domain_id = d.id)
                  END
             END
        ) as chain_enabled,
        r.updated_at, 'private' as ownership
      FROM room r
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE r.identity_id = $1
        AND r.ephemeral = false

      UNION

      SELECT r.id, r.name, d.name as domain_name,
        d.domain_attr->>'url' as domain_url, r.enabled,
        (i2.enabled AND p.enabled AND d.enabled AND i1.enabled
         AND CASE d.identity_id
             WHEN $1 THEN true
             WHEN i2.id THEN true
             ELSE CASE d.public
                  WHEN true THEN true
                  ELSE (SELECT enabled
                        FROM domain_partner
                        WHERE identity_id = i2.id
                          AND domain_id = d.id)
                  END
             END
        ) as chain_enabled, r.updated_at, 'partner' as ownership
      FROM room_partner p
        JOIN room r ON p.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
      WHERE p.identity_id = $1
        AND r.ephemeral = false

      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as RoomReduced[];
}

// -----------------------------------------------------------------------------
export async function addRoom(
  identityId: string,
  domainId: string,
  name: string,
  hasSuffix: boolean,
) {
  const sql = {
    text: `
      INSERT INTO room (identity_id, domain_id, name, has_suffix, ephemeral)
      VALUES (
        $1,
        (SELECT id
         FROM domain
         WHERE id = $2
           AND (identity_id = $1
                OR id IN (SELECT domain_id
                          FROM domain_partner
                          WHERE identity_id = $1
                         )
                OR public = true
               )
        ),
        $3, $4, false)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      domainId,
      name,
      hasSuffix,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function addEphemeralRoom(
  identityId: string,
  domainId: string,
) {
  const sql = {
    text: `
      INSERT INTO room (identity_id, domain_id, name, has_suffix, ephemeral)
      VALUES (
        $1,
        (SELECT id
         FROM domain
         WHERE id = $2
           AND (identity_id = $1
                OR id IN (SELECT domain_id
                          FROM domain_partner
                          WHERE identity_id = $1
                         )
                OR public = true
               )
        ),
        'room-' || md5(gen_random_uuid()::text),
        false, true)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      domainId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delRoom(identityId: string, roomId: string) {
  const sql = {
    text: `
      DELETE FROM room
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      roomId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateRoom(
  identityId: string,
  roomId: string,
  domainId: string,
  name: string,
  hasSuffix: boolean,
) {
  const sql = {
    text: `
      UPDATE room
      SET
        domain_id = (SELECT id
                     FROM domain
                     WHERE id = $3
                       AND (identity_id = $1
                            OR id IN (SELECT domain_id
                                      FROM domain_partner
                                      WHERE identity_id = $1
                                     )
                            OR public = true
                           )
                    ),
        name = $4,
        has_suffix = $5,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      roomId,
      domainId,
      name,
      hasSuffix,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateRoomEnabled(
  identityId: string,
  roomId: string,
  value = true,
) {
  const sql = {
    text: `
      UPDATE room
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      roomId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateRoomSuffix(roomId: string) {
  const sql = {
    text: `
      UPDATE room
      SET
        suffix = DEFAULT
      WHERE id = $1
        AND has_suffix = true
        AND accessed_at + interval '4 hours' < now()
      RETURNING id, now() as at`,
    args: [
      roomId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateRoomAccessTime(roomId: string) {
  const sql = {
    text: `
      UPDATE room
      SET
        accessed_at = now()
      WHERE id = $1
      RETURNING id, accessed_at as at`,
    args: [
      roomId,
    ],
  };

  return await fetch(sql) as Id[];
}
