import { fetch } from "./common.ts";
import type { Id } from "./types.ts";

// -----------------------------------------------------------------------------
// Keycloak setup has its own version of addIdentity. See identity-kc.ts
// -----------------------------------------------------------------------------
export async function addIdentity(identityId: string) {
  const sql = {
    text: `
      INSERT INTO identity (id)
      VALUES ($1)
      RETURNING id, created_at as at`,
    args: [
      identityId,
    ],
  };

  return await fetch(sql) as Id[];
}
// -----------------------------------------------------------------------------
// This function is only run in Kratos setup. Keycloak uses addIdentity to set
// the email.
// -----------------------------------------------------------------------------
export async function setIdentityEmail(identityId: string, email: string) {
  const sql = {
    text: `
      UPDATE identity
      SET
        identity_attr['email'] = to_jsonb($2::text)
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
