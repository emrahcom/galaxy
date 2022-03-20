import { fetch } from "./common.ts";
import type { Domain, DomainReduced, Id } from "./types.ts";

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
export async function listDomain(
  identityId: string,
  limit: number,
  offset: number,
) {
  // updated_at is used to choice the newest one on UI
  const sql = {
    text: `
      SELECT id, name, auth_type, domain_attr->>'url' as url, enabled,
        updated_at, 'private' as ownership
      FROM domain
      WHERE identity_id = $1

      UNION

      SELECT d.id, d.name, d.auth_type, d.domain_attr->>'url' as url,
        (p.enabled AND d.enabled AND i.enabled) as enabled,
        p.updated_at, 'partner' as ownership
      FROM domain_partner p
        JOIN domain d ON p.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE p.identity_id = $1

      UNION

      SELECT id, name, auth_type, domain_attr->>'url' as url, true,
        created_at as updated_at, 'public' as ownership
      FROM domain
      WHERE public = true
        AND enabled = true
      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as DomainReduced[];
}

// -----------------------------------------------------------------------------
export async function addDomain(
  identityId: string,
  name: string,
  authType: string,
  domainAttr: unknown,
) {
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
  domainAttr: unknown,
) {
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
