import { fetch } from "./common.ts";
import type { Id, Phone } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getPhone(identityId: string, phoneId: string) {
  const sql = {
    text: `
      SELECT ph.id, ph.name, ph.code, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        d.enabled as domain_enabled,
        pr.id as profile_id, pr.name as profile_name, pr.email as profile_email,
        ph.enabled, ph.created_at, ph.updated_at, ph.called_at
      FROM phone ph
        JOIN domain d ON ph.domain_id = d.id
        JOIN profile pr ON ph.profile_id = profile.id
      WHERE ph.id = $2
        AND ph.identity_id = $1`,
    args: [
      identityId,
      phoneId,
    ],
  };

  return await fetch(sql) as Phone[];
}

// -----------------------------------------------------------------------------
export async function listPhone(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT ph.id, ph.name, ph.code, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        d.enabled as domain_enabled,
        pr.id as profile_id, pr.name as profile_name, pr.email as profile_email,
        ph.enabled, ph.created_at, ph.updated_at, ph.called_at
      FROM phone ph
        JOIN domain d ON ph.domain_id = d.id
        JOIN profile pr ON ph.profile_id = profile.id
      WHERE ph.identity_id = $1
      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Phone[];
}

// -----------------------------------------------------------------------------
export async function addPhone(
  identityId: string,
  name: string,
) {
  const sql = {
    text: `
      RETURNING id, created_at as at`,
    args: [
      identityId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delPhone(identityId: string, phoneId: string) {
  const sql = {
    text: `
      DELETE FROM phone
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      phoneId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updatePhone(
  identityId: string,
  phoneId: string,
  name: string,
) {
  const sql = {
    text: `
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      phoneId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updatePhoneEnabled(
  identityId: string,
  phoneId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE phone
      SET
        enabled = $3,
        updated_at = now(),
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      phoneId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
