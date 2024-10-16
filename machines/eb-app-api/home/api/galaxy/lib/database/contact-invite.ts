import { fetch } from "./common.ts";
import type { ContactInvite, ContactInvite111, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getContactInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      SELECT iv.id, iv.name, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        iv.code, iv.enabled, iv.created_at, iv.updated_at, iv.expired_at
      FROM domain_invite iv
        JOIN domain d ON iv.domain_id = d.id
      WHERE iv.id = $2
        AND iv.identity_id = $1
        AND iv.expired_at > now()`,
    args: [
      identityId,
      inviteId,
    ],
  };

  return await fetch(sql) as ContactInvite[];
}

// -----------------------------------------------------------------------------
export async function getContactInviteByCode(code: string) {
  const sql = {
    text: `
      SELECT d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        iv.code
      FROM domain_invite iv
        JOIN domain d ON iv.domain_id = d.id
      WHERE iv.code = $1
        AND iv.enabled
        AND iv.expired_at > now()`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as ContactInvite111[];
}

// -----------------------------------------------------------------------------
export async function listContactInvite(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT iv.id, iv.name, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        iv.code, iv.enabled, iv.created_at, iv.updated_at, iv.expired_at
      FROM domain_invite iv
        JOIN domain d ON iv.domain_id = d.id
      WHERE iv.identity_id = $1
        AND iv.domain_id = $2
        AND iv.expired_at > now()
      ORDER BY iv.updated_at DESC
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as ContactInvite[];
}

// -----------------------------------------------------------------------------
export async function addContactInvite(
  identityId: string,
  name: string,
  disposable: boolean,
) {
  const sql = {
    text: `
      INSERT INTO contact_invite (identity_id, name)
      VALUES ($1, $2)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      name,
      disposable,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delContactInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      DELETE FROM contact_invite
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
export async function updateContactInviteEnabled(
  identityId: string,
  inviteId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE contact_invite
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
