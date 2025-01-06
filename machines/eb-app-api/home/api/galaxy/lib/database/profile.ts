import { fetch, pool } from "./common.ts";
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
        AND is_default
      LIMIT 1`,
    args: [
      identityId,
    ],
  };

  return await fetch(sql) as Profile[];
}

// -----------------------------------------------------------------------------
export async function getDefaultProfileByCode(code: string) {
  const sql = {
    text: `
      SELECT id, name, email, is_default, created_at, updated_at
      FROM profile
      WHERE identity_id = (SELECT identity_id
                           FROM identity_key
                           WHERE code = $1
                             AND enabled
                          )
        AND is_default
      LIMIT 1`,
    args: [
      code,
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
  using client = await pool.connect();
  const trans = client.createTransaction("transaction");
  await trans.begin();

  // Select the default profile instead of the deleted one in meeting.
  const sql1 = {
    text: `
      UPDATE meeting
      SET
        profile_id = (SELECT id
                      FROM profile
                      WHERE identity_id = $1
                        AND is_default
                        AND id != $2
                     ),
        updated_at = now()
      WHERE identity_id = $1
        AND profile_id = $2`,
    args: [
      identityId,
      profileId,
    ],
  };
  await trans.queryObject(sql1);

  // Select the default profile instead of the deleted one in meeting_member.
  const sql2 = {
    text: `
      UPDATE meeting_member
      SET
        profile_id = (SELECT id
                      FROM profile
                      WHERE identity_id = $1
                        AND is_default
                        AND id != $2
                     ),
        updated_at = now()
      WHERE identity_id = $1
        AND profile_id = $2`,
    args: [
      identityId,
      profileId,
    ],
  };
  await trans.queryObject(sql2);

  // Select the default profile instead of the deleted one in meeting_request.
  const sql3 = {
    text: `
      UPDATE meeting_request
      SET
        profile_id = (SELECT id
                      FROM profile
                      WHERE identity_id = $1
                        AND is_default
                        AND id != $2
                     ),
        updated_at = now()
      WHERE identity_id = $1
        AND profile_id = $2`,
    args: [
      identityId,
      profileId,
    ],
  };
  await trans.queryObject(sql3);

  // Select the default profile instead of the deleted one in phone.
  const sql4 = {
    text: `
      UPDATE phone
      SET
        profile_id = (SELECT id
                      FROM profile
                      WHERE identity_id = $1
                        AND is_default
                        AND id != $2
                     ),
        updated_at = now()
      WHERE identity_id = $1
        AND profile_id = $2`,
    args: [
      identityId,
      profileId,
    ],
  };
  await trans.queryObject(sql4);

  const sql = {
    text: `
      DELETE FROM profile
      WHERE id = $2
        AND identity_id = $1
        AND NOT is_default
      RETURNING id, now() as at`,
    args: [
      identityId,
      profileId,
    ],
  };
  const { rows: rows } = await trans.queryObject(sql);

  await trans.commit();

  return rows as Id[];
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
  using client = await pool.connect();
  const trans = client.createTransaction("transaction");
  await trans.begin();

  // Note: Don't add is_default checking into WHERE. User can set a profile as
  // as default even though it is default to solve the duplicated defaults
  // issue. UI should also support this feature.
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
  const { rows: rows } = await trans.queryObject(sql);

  // Reset the old default if the set action is successful.
  const sql1 = {
    text: `
      UPDATE profile
      SET
        is_default = false,
        updated_at = now()
      WHERE identity_id = $1
        AND id != $2
        AND is_default`,
    args: [
      identityId,
      profileId,
    ],
  };
  if (rows[0] !== undefined) await trans.queryObject(sql1);

  await trans.commit();

  return rows as Id[];
}
