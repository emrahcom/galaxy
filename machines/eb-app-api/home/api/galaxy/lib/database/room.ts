import { fetch } from "./common.ts";
import type { Id, Room, RoomLinkSet } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoom(identityId: string, roomId: string) {
  const sql = {
    text: `
      SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
        r.has_suffix, r.suffix, r.enabled,
        (r.enabled AND d.enabled AND i.enabled) as chain_enabled,
        r.created_at, r.updated_at, r.accessed_at
      FROM room r
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
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

  const sql = {
    text: `
      SELECT r.name, r.has_suffix, r.suffix, d.auth_type, d.auth_attr
      FROM room r
        JOIN domain d ON r.domain_id = d.id
      WHERE r.id = $2
        AND r.identity_id = $1
        AND r.ephemeral = false`,
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
  const sql = {
    text: `
      SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
        r.has_suffix, r.suffix, r.enabled,
        (r.enabled AND d.enabled AND i.enabled) as chain_enabled,
        r.created_at, r.updated_at, r.accessed_at
      FROM room r
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE r.identity_id = $1
        AND r.ephemeral = false
      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Room[];
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
                OR public = true)),
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
                OR public = true)),
        'meeting-' || md5(gen_random_uuid()::text),
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
                            OR public = true)),
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
        suffix = DEFAULT,
        accessed_at = now()
      WHERE id = $1
        AND has_suffix = true
        AND accessed_at + interval '4 hours' < now()
      RETURNING id, accessed_at as at`,
    args: [
      roomId,
    ],
  };

  return await fetch(sql) as Id[];
}
