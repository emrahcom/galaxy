import { fetch } from "./common.ts";
import type { Id, Identity } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getIdentity(identityId: string) {
  const sql = {
    text: `
      SELECT identity_attr, enabled, created_at, updated_at, seen_at
      FROM identity
      WHERE id = $1`,
    args: [
      identityId,
    ],
  };

  return await fetch(sql) as Identity[];
}

// -----------------------------------------------------------------------------
// The consumer is the mailer. So, dont return the identity if the email for
// this phone is disabled.
// -----------------------------------------------------------------------------
export async function getIdentityByPhoneCode(code: string) {
  const sql = {
    text: `
      SELECT identity_attr, i.enabled, i.created_at, i.updated_at, seen_at
      FROM identity i
        JOIN phone ph ON ph.identity_id = i.id
                         AND ph.code = $1
                         AND ph.email_enabled
      WHERE i.enabled`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as Identity[];
}

// -----------------------------------------------------------------------------
export async function setIdentityEmail(identityId: string, email: string) {
  const sql = {
    text: `
      UPDATE identity
      SET
        identity_attr['email'] = to_jsonb($2::text),
        updated_at = now()
      WHERE id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      email,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updatePresence(identityId: string) {
  const sql = {
    text: `
      UPDATE identity
      SET
        seen_at = now()
      WHERE id = $1
      RETURNING id, seen_at as at`,
    args: [
      identityId,
    ],
  };

  return await fetch(sql) as Id[];
}
