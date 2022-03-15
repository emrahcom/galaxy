import { fetch } from "./common.ts";
import type { Domain, DomainPublic, DomainReduced, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getDomain(identityId: string, domainId: string) {
  const sql = {
    text: `
      SELECT d.id, d.name, d.auth_type, d.domain_attr, d.enabled,
        i.enabled as owner_enabled, (i.enabled AND d.enabled) as chain_enabled,
        d.created_at, d.updated_at
      FROM domain d
        JOIN identity i ON d.identity_id = i.id
      WHERE d.id = $2
        AND d.identity_id = $1`,
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
  const sql = {
    text: `
      SELECT d.id, d.name, d.auth_type, d.domain_attr, d.enabled,
        i.enabled as owner_enabled, (i.enabled AND d.enabled) as chain_enabled,
        d.created_at, d.updated_at
      FROM domain d
        JOIN identity i ON d.identity_id = i.id
      WHERE d.identity_id = $1
      ORDER BY d.name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Domain[];
}

// -----------------------------------------------------------------------------
export async function listEnabledPublicDomain(limit: number, offset: number) {
  const sql = {
    text: `
      SELECT d.id, d.name
      FROM domain d
        JOIN identity i ON d.identity_id = i.id
      WHERE d.public = true
        AND d.enabled = true
        AND i.enabled = true
      ORDER BY name
      LIMIT $1 OFFSET $2`,
    args: [
      limit,
      offset,
    ],
  };

  return await fetch(sql) as PubDomain[];
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
