import { fetch } from "./common.ts";
import type { ContactInvite, ContactInvite111, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getContactInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      SELECT id, name, code, disposable, enabled, created_at, updated_at,
        expired_at
      FROM contact_invite
      WHERE id = $2
        AND identity_id = $1
        AND expired_at > now()`,
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
      SELECT pr.name as profile_name, pr.email as profile_email, iv.code
      FROM contact_invite iv
        LEFT JOIN profile pr ON iv.identity_id = pr.identity_id
                                AND pr.is_default
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
      SELECT id, name, code, disposable, enabled, created_at, updated_at,
        expired_at
      FROM contact_invite
      WHERE identity_id = $1
        AND expired_at > now()
      ORDER BY updated_at DESC
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
      INSERT INTO contact_invite (identity_id, name, disposable)
      VALUES ($1, $2, $3)
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
