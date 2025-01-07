import { fetch } from "./common.ts";
import { generateRoomUrl } from "../common/helper.ts";
import { getDefaultProfile, getDefaultProfileByKey } from "./profile.ts";
import type {
  Affiliation,
  Id,
  Profile,
  RandomRoomName,
  Room,
  Room333,
  RoomLinkset,
} from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoom(identityId: string, roomId: string) {
  const sql = {
    text: `
      SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        d.enabled as domain_enabled, r.has_suffix, r.enabled, r.created_at,
        r.updated_at, r.accessed_at
      FROM room r
        JOIN domain d ON r.domain_id = d.id
      WHERE r.id = $2
        AND r.identity_id = $1
        AND NOT r.ephemeral`,
    args: [
      identityId,
      roomId,
    ],
  };

  return await fetch(sql) as Room[];
}

// -----------------------------------------------------------------------------
export async function getRoomLinkset(identityId: string, roomId: string) {
  await updateRoomSuffix(roomId);
  await updateRoomAccessTime(roomId);

  const sql = {
    text: `
      SELECT r.name, r.has_suffix, r.suffix, d.auth_type, d.domain_attr
      FROM room r
        JOIN domain d ON r.domain_id = d.id
                         AND d.enabled
        JOIN identity i ON d.identity_id = i.id
                           AND i.enabled
      WHERE r.id = $2
        AND r.identity_id = $1
        AND NOT r.ephemeral
        AND (d.public
             OR d.identity_id = $1
             OR EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = $1
                          AND domain_id = d.id
                          AND enabled
                       )
            )

      UNION

      SELECT r.name, r.has_suffix, r.suffix, d.auth_type, d.domain_attr
      FROM room_partner pa
        JOIN room r ON pa.room_id = r.id
                       AND r.enabled
                       AND NOT r.ephemeral
        JOIN domain d ON r.domain_id = d.id
                         AND d.enabled
        JOIN identity i1 ON d.identity_id = i1.id
                            AND i1.enabled
        JOIN identity i2 ON r.identity_id = i2.id
                            AND i2.enabled
      WHERE pa.identity_id = $1
        AND pa.room_id = $2
        AND pa.enabled
        AND (d.public
             OR d.identity_id = r.identity_id
             OR EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = r.identity_id
                          AND domain_id = d.id
                          AND enabled
                       )
            )`,
    args: [
      identityId,
      roomId,
    ],
  };

  return await fetch(sql) as RoomLinkset[];
}

// -----------------------------------------------------------------------------
export async function getRandomRoomName(prefix: string) {
  const sql = {
    text: `
      SELECT
        '${prefix}' || md5(gen_random_uuid()::text) as name,
        md5(gen_random_uuid()::text) as suffix`,
  };

  return await fetch(sql) as RandomRoomName[];
}

// -----------------------------------------------------------------------------
export async function getRoomUrl(
  identityId: string,
  roomLinkset: RoomLinkset,
  affiliation: Affiliation,
  exp: number,
  additionalHash: string,
) {
  const profiles = await getDefaultProfile(identityId) as Profile[];
  const profile = profiles[0];
  if (!profile) throw "profile is not available";

  return await generateRoomUrl(
    roomLinkset,
    profile,
    affiliation,
    exp,
    additionalHash,
  );
}

// -----------------------------------------------------------------------------
export async function getRoomUrlByKey(
  keyValue: string,
  roomLinkset: RoomLinkset,
  affiliation: Affiliation,
  exp: number,
  additionalHash: string,
) {
  const profiles = await getDefaultProfileByKey(keyValue) as Profile[];
  const profile = profiles[0];
  if (!profile) throw "profile is not available";

  return await generateRoomUrl(
    roomLinkset,
    profile,
    affiliation,
    exp,
    additionalHash,
  );
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
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        r.enabled,
        (d.enabled AND i.enabled
         AND CASE d.identity_id
               WHEN $1 THEN true
               ELSE CASE d.public
                      WHEN true THEN true
                      ELSE (SELECT enabled
                            FROM domain_partner
                            WHERE identity_id = $1
                              AND domain_id = d.id
                           )
                    END
             END
        ) as chain_enabled,
        r.updated_at, 'owner' as ownership, r.id as partnership_id
      FROM room r
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE r.identity_id = $1
        AND NOT r.ephemeral

      UNION

      SELECT r.id, r.name, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        r.enabled,
        (pa.enabled
         AND r.enabled AND i2.enabled
         AND d.enabled AND i1.enabled
         AND CASE d.identity_id
               WHEN r.identity_id THEN true
               ELSE CASE d.public
                      WHEN true THEN true
                      ELSE (SELECT enabled
                            FROM domain_partner
                            WHERE identity_id = r.identity_id
                              AND domain_id = d.id
                           )
                    END
             END
        ) as chain_enabled, r.updated_at, 'partner' as ownership,
        pa.id as partnership_id
      FROM room_partner pa
        JOIN room r ON pa.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
      WHERE pa.identity_id = $1
        AND NOT r.ephemeral

      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Room333[];
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
         FROM domain d
         WHERE id = $2
           AND (identity_id = $1
                OR public
                OR EXISTS (SELECT 1
                           FROM domain_partner
                           WHERE identity_id = $1
                             AND domain_id = d.id
                          )
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
         FROM domain d
         WHERE id = $2
           AND (identity_id = $1
                OR public
                OR EXISTS (SELECT 1
                           FROM domain_partner
                           WHERE identity_id = $1
                             AND domain_id = d.id
                          )
               )
        ),
        'room-' || md5(gen_random_uuid()::text),
        true, true)
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
                     FROM domain d
                     WHERE id = $3
                       AND (identity_id = $1
                            OR public
                            OR EXISTS (SELECT 1
                                       FROM domain_partner
                                       WHERE identity_id = $1
                                         AND domain_id = d.id
                                      )
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
        AND has_suffix
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
        accessed_at = now(),
        attendance = attendance + 1
      WHERE id = $1
      RETURNING id, accessed_at as at`,
    args: [
      roomId,
    ],
  };

  return await fetch(sql) as Id[];
}
