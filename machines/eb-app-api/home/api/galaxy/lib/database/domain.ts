import { checkAttr, fetch } from "./common.ts";
import type { Attr, Domain, Domain333, Id } from "./types.ts";

// -----------------------------------------------------------------------------
// This function returns the domain if it belongs to identity.
// -----------------------------------------------------------------------------
export async function getDomain(identityId: string, domainId: string) {
  const sql = {
    text: `
      SELECT id, name, auth_type, domain_attr, enabled, created_at, updated_at
      FROM domain
      WHERE id = $2
        AND identity_id = $1`,
    args: [
      identityId,
      domainId,
    ],
  };

  return await fetch(sql) as Domain[];
}

// -----------------------------------------------------------------------------
// This function returns the domain if it is accessible by identity, even it
// doesn't belong to her.
// -----------------------------------------------------------------------------
export async function getDomainIfAllowed(identityId: string, domainId: string) {
  const sql = {
    text: `
      SELECT id, name, auth_type, domain_attr, enabled, created_at, updated_at
      FROM domain d
      WHERE id = $2
        AND enabled
        AND (identity_id = $1
             OR public
             OR EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = $1
                          AND domain_id = d.id
                       )
            )`,
    args: [
      identityId,
      domainId,
    ],
  };

  return await fetch(sql) as Domain[];
}

// -----------------------------------------------------------------------------
// This function returns the domain for the identity key.
// -----------------------------------------------------------------------------
export async function getDomainByKeyIfAllowed(keyValue: string) {
  const sql = {
    text: `
      SELECT d.id, d.name, auth_type, domain_attr, d.enabled, d.created_at,
        d.updated_at
      FROM identity_key ik
        JOIN domain d ON d.id = ik.domain_id
      WHERE value = $1
        AND ik.enabled
        AND d.enabled
        AND (d.identity_id = ik.identity_id
             OR public
             OR EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = ik.identity_id
                          AND domain_id = d.id
                       )
            )`,
    args: [
      keyValue,
    ],
  };

  return await fetch(sql) as Domain[];
}

// -----------------------------------------------------------------------------
export async function listDomain(
  identityId: string,
  limit: number,
  offset: number,
) {
  // updated_at is used by UI to pick the newest one
  const sql = {
    text: `
      SELECT id, name, auth_type,
        (CASE auth_type
           WHEN 'jaas' THEN domain_attr->>'jaas_url'
           ELSE domain_attr->>'url'
         END
        ) as url,
        enabled, updated_at, 'owner' as ownership, id as partnership_id
      FROM domain
      WHERE identity_id = $1

      UNION

      SELECT d.id, d.name, d.auth_type,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as url,
        (pa.enabled AND d.enabled AND i.enabled) as enabled,
        pa.updated_at, 'partner' as ownership, pa.id as partnership_id
      FROM domain_partner pa
        JOIN domain d ON pa.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE pa.identity_id = $1

      UNION

      SELECT id, name, auth_type,
        (CASE auth_type
           WHEN 'jaas' THEN domain_attr->>'jaas_url'
           ELSE domain_attr->>'url'
         END
        ) as url,
        true, created_at as updated_at, 'public' as ownership,
        id as partnership_id
      FROM domain
      WHERE public
        AND enabled

      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Domain333[];
}

// -----------------------------------------------------------------------------
export async function addDomain(
  identityId: string,
  name: string,
  authType: string,
  domainAttr: Attr,
) {
  // check the structure of json. it will throw an error if it is not valid.
  checkAttr(domainAttr);

  const sql = {
    text: `
      INSERT INTO domain (identity_id, name, auth_type, domain_attr)
      VALUES ($1, $2, $3, $4::jsonb)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      name,
      authType,
      domainAttr,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delDomain(identityId: string, domainId: string) {
  const sql = {
    text: `
      DELETE FROM domain
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      domainId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateDomain(
  identityId: string,
  domainId: string,
  name: string,
  authType: string,
  domainAttr: Attr,
) {
  // check the structure of json. it will throw an error if it is not valid.
  checkAttr(domainAttr);

  const sql = {
    text: `
      UPDATE domain
      SET
        name = $3,
        auth_type = $4,
        domain_attr = $5::jsonb,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      domainId,
      name,
      authType,
      domainAttr,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateDomainEnabled(
  identityId: string,
  domainId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE domain
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      domainId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
