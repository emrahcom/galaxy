import { fetch } from "./common.ts";
import type { Id, Identity } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getIdentity(identityId: string) {
  const sql = {
    text: `
      SELECT id, identity_attr, enabled, created_at, updated_at, seen_at
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
export async function getIdentityByCode(code: string) {
  const sql = {
    text: `
      SELECT i.id, identity_attr, i.enabled, i.created_at, i.updated_at, seen_at
      FROM identity i
        JOIN phone ph ON ph.identity_id = i.id
                         AND ph.code = $1
                         AND ph.enabled
                         AND ph.email_enabled
        JOIN domain d ON ph.domain_id = d.id
                         AND d.enabled
      WHERE i.enabled`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as Identity[];
}

// -----------------------------------------------------------------------------
// The consumer is internal while processing requests from a user accessing by
// using an identity key.
// -----------------------------------------------------------------------------
export async function getIdentityByKey(keyValue: string) {
  const sql = {
    text: `
      SELECT id, identity_attr, enabled, created_at, updated_at, seen_at
      FROM identity
      WHERE id = (SELECT identity_id
                  FROM identity_key
                  WHERE value = $1
                    AND enabled
                 )`,
    args: [
      keyValue,
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

// -----------------------------------------------------------------------------
export async function updatePresenceByKey(keyValue: string) {
  const sql = {
    text: `
      UPDATE identity
      SET
        seen_at = now()
      WHERE id = (SELECT identity_id
                  FROM identity_key
                  WHERE value = $1
                    AND enabled
                 )
      RETURNING id, seen_at as at`,
    args: [
      keyValue,
    ],
  };

  return await fetch(sql) as Id[];
}
