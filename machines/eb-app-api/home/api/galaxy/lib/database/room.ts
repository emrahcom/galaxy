import { fetch } from "./common.ts";
import { getDefaultProfile } from "./profile.ts";
import type { Id, Room } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRoom(identityId: string, roomId: string) {
  const sql = {
    text: `
      SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
        r.has_suffix, r.suffix, r.enabled, r.created_at, r.updated_at,
        r.accessed_at, (r.enabled AND d.enabled AND i.enabled) as
        chain_enabled
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
export async function getRoomLink(identityId: string, roomId: string) {
  const profile = getDefaultProfile(identityId);
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
  const rooms = await fetch(sql) as Room[];
  const room = rooms[0];

  return {
    link: `${room.auth_attr.url}?name=${profile.name}`,
  };
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
        r.has_suffix, r.suffix, r.enabled, r.created_at, r.updated_at,
        r.accessed_at, (r.enabled AND d.enabled AND i.enabled) as
        chain_enabled
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
