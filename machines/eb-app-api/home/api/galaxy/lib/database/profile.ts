import { fetch, query } from "./common.ts";
import type { Id, Profile } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getProfile(identityId: string, profileId: string) {
  const sql = {
    text: `
      SELECT id, name, email, is_default, created_at, updated_at
      FROM profile
      WHERE id = $2
        AND identity_id = $1`,
    args: [
      identityId,
      profileId,
    ],
  };

  return await fetch(sql) as Profile[];
}

// -----------------------------------------------------------------------------
export async function getDefaultProfile(identityId: string) {
  const sql = {
    text: `
      SELECT id, name, email, is_default, created_at, updated_at
      FROM profile
      WHERE identity_id = $1
        AND is_default = true
      LIMIT 1`,
    args: [
      identityId,
    ],
  };

  return await fetch(sql) as Profile[];
}

// -----------------------------------------------------------------------------
export async function listProfile(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT id, name, email, is_default, created_at, updated_at
      FROM profile
      WHERE identity_id = $1
      ORDER BY name, email
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Profile[];
}

// -----------------------------------------------------------------------------
export async function addProfile(
  identityId: string,
  name: string,
  email: string,
  isDefault = false,
) {
  const sql = {
    text: `
      INSERT INTO profile (identity_id, name, email, is_default)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      name,
      email,
      isDefault,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delProfile(identityId: string, profileId: string) {
  const sql = {
    text: `
      DELETE FROM profile
      WHERE id = $2
        AND identity_id = $1
        AND is_default = false
      RETURNING id, now() as at`,
    args: [
      identityId,
      profileId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateProfile(
  identityId: string,
  profileId: string,
  name: string,
  email: string,
) {
  const sql = {
    text: `
      UPDATE profile
      SET
        name = $3,
        email = $4,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      profileId,
      name,
      email,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function setDefaultProfile(identityId: string, profileId: string) {
  // note: don't add an is_default checking into WHERE. user should set a
  // profile as default although it's already default to solve the duplicated
  // defaults issue. Also UI should support this.
  const sql = {
    text: `
      UPDATE profile
      SET
        is_default = true,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      profileId,
    ],
  };
  const rows = await fetch(sql) as Id[];

  // reset the old default if the set action is successful
  const sql1 = {
    text: `
      UPDATE profile
      SET
        is_default = false,
        updated_at = now()
      WHERE identity_id = $1
        AND id != $2
        AND is_default = true`,
    args: [
      identityId,
      profileId,
    ],
  };
  if (rows[0] !== undefined) await query(sql1);

  return rows;
}
