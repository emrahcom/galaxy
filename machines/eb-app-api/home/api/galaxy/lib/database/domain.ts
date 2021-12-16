import { fetch, idRows } from "./common.ts";

// -----------------------------------------------------------------------------
interface domainRows {
  [index: number]: {
    id: string;
    name: string;
    auth_type: string;
    auth_attr: unknown;
    enabled: boolean;
    created_at: string;
    updated_at: string;
  };
}

// -----------------------------------------------------------------------------
interface pubDomainRows {
  [index: number]: {
    id: string;
    name: string;
  };
}

// -----------------------------------------------------------------------------
export async function getDomain(identityId: string, domainId: string) {
  const sql = {
    text: `
      SELECT id, name, auth_type, auth_attr, enabled, created_at, updated_at
      FROM domain
      WHERE id = $2
        AND identity_id = $1`,
    args: [
      identityId,
      domainId,
    ],
  };

  return await fetch(sql) as domainRows;
}

// -----------------------------------------------------------------------------
export async function listDomain(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT id, name, auth_type, auth_attr, enabled, created_at, updated_at
      FROM domain
      WHERE identity_id = $1
      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as domainRows;
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

  return await fetch(sql) as pubDomainRows;
}

// -----------------------------------------------------------------------------
export async function addDomain(
  identityId: string,
  name: string,
  authType: string,
  authAttr: unknown,
) {
  const sql = {
    text: `
      INSERT INTO domain (identity_id, name, auth_type, auth_attr)
      VALUES ($1, $2, $3, $4::jsonb)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      name,
      authType,
      authAttr,
    ],
  };

  return await fetch(sql) as idRows;
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

  return await fetch(sql) as idRows;
}

// -----------------------------------------------------------------------------
export async function updateDomain(
  identityId: string,
  domainId: string,
  name: string,
  authType: string,
  authAttr: unknown,
) {
  const sql = {
    text: `
      UPDATE domain
      SET
        name = $3,
        auth_type = $4,
        auth_attr = $5::jsonb,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      domainId,
      name,
      authType,
      authAttr,
    ],
  };

  return await fetch(sql) as idRows;
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

  return await fetch(sql) as idRows;
}
