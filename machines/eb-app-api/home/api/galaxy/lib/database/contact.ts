import { fetch, query } from "./common.ts";
import type { Contact, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getContact(identityId: string, contactId: string) {
  const sql = {
    text: `
      SELECT c.id, c.name, p.name as profile_name, p.email as profile_email,
        c.created_at, c.updated_at
      FROM contact c
        JOIN profile p ON c.remote_id = p.identity_id
                          AND p.is_default
      WHERE c.id = $2
        AND c.identity_id = $1`,
    args: [
      identityId,
      contactId,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
export async function listContact(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT c.id, c.name, p.name as profile_name, p.email as profile_email,
        c.created_at, c.updated_at
      FROM contact c
        JOIN profile p ON c.remote_id = p.identity_id
                          AND p.is_default
      WHERE c.identity_id = $1
      ORDER BY name, profile_name, profile_email
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
export async function listContactByDomain(
  identityId: string,
  domainId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT c.id, c.name, p.name as profile_name, p.email as profile_email,
        c.created_at, c.updated_at
      FROM contact c
        JOIN profile p ON c.remote_id = p.identity_id
                          AND p.is_default
      WHERE c.identity_id = $1
        AND NOT EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = c.remote_id
                          AND domain_id = $2
                       )
        AND NOT EXISTS (SELECT 1
                        FROM domain_candidate
                        WHERE identity_id = c.remote_id
                          AND domain_id = $2
                       )
      ORDER BY name, profile_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      domainId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
export async function delContact(identityId: string, contactId: string) {
  // before deleting the contact, delete the contact owner from the contact's
  // contact list.
  const sql0 = {
    text: `
      DELETE FROM contact
      WHERE remote_id = $1
        AND identity_id = (SELECT remote_id
                           FROM contact
                           WHERE id = $2
                          )`,
    args: [
      identityId,
      contactId,
    ],
  };
  await query(sql0);

  const sql = {
    text: `
      DELETE FROM contact
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      contactId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateContact(
  identityId: string,
  contactId: string,
  name: string,
) {
  const sql = {
    text: `
      UPDATE contact
      SET
        name = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      contactId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}
