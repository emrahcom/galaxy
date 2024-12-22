import { fetch } from "./common.ts";
import type { IdentityKey, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getIdentityKey(identityId: string, keyId: string) {
  const sql = {
    text: `
      SELECT id, name, code, enabled, created_at, updated_at
      FROM identity_key
      WHERE id = $2
        AND identity_id = $1`,
    args: [
      identityId,
      keyId,
    ],
  };

  return await fetch(sql) as IdentityKey[];
}

// -----------------------------------------------------------------------------
export async function listIdentityKey(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT id, name, code, enabled, created_at, updated_at
      FROM identity_key
      WHERE identity_id = $1
      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as IdentityKey[];
}

// -----------------------------------------------------------------------------
export async function addIdentityKey(
  identityId: string,
  name: string,
) {
  const sql = {
    text: `
      INSERT INTO identity_key (identity_id, name)
      VALUES ($1, $2)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delIdentityKey(identityId: string, keyId: string) {
  const sql = {
    text: `
      DELETE FROM identity_key
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      keyId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateIdentityKeyEnabled(
  identityId: string,
  keyId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE identity_key
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      keyId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
