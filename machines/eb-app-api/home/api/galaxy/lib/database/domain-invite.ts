import { fetch } from "./common.ts";
import type { DomainInvite, DomainInviteReduced, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getDomainInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      SELECT i.id, i.name, d.id as domain_id, d.name as domain_name,
        d.domain_attr->>'url' as domain_url, i.code, i.enabled, i.created_at,
        i.updated_at, i.expired_at
      FROM domain_invite i
        JOIN domain d ON i.domain_id = d.id
      WHERE i.id = $2
        AND i.identity_id = $1
        AND i.expired_at > now()`,
    args: [
      identityId,
      inviteId,
    ],
  };

  return await fetch(sql) as DomainInvite[];
}

// -----------------------------------------------------------------------------
export async function getDomainInviteByCode(code: string) {
  const sql = {
    text: `
      SELECT d.name as domain_name, d.domain_attr->>'url' as domain_url, i.code
      FROM domain_invite i
        JOIN domain d ON i.domain_id = d.id
      WHERE i.code = $1
        AND i.enabled
        AND i.expired_at > now()`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as DomainInviteReduced[];
}

// -----------------------------------------------------------------------------
export async function listDomainInviteByDomain(
  identityId: string,
  domainId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT i.id, i.name, d.id as domain_id, d.name as domain_name,
        d.domain_attr->>'url' as domain_url, i.code, i.enabled, i.created_at,
        i.updated_at, i.expired_at
      FROM domain_invite i
        JOIN domain d ON i.domain_id = d.id
      WHERE i.identity_id = $1
        AND i.domain_id = $2
        AND i.expired_at > now()
      ORDER BY i.updated_at DESC
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      domainId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as DomainInvite[];
}

// -----------------------------------------------------------------------------
export async function addDomainInvite(
  identityId: string,
  domainId: string,
  name: string,
) {
  const sql = {
    text: `
      INSERT INTO domain_invite (identity_id, domain_id, name)
      VALUES (
        $1,
        (SELECT id
         FROM domain
         WHERE id = $2
           AND identity_id = $1
        ),
        $3
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      domainId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delDomainInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      DELETE FROM domain_invite
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
export async function updateDomainInviteEnabled(
  identityId: string,
  inviteId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE domain_invite
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
