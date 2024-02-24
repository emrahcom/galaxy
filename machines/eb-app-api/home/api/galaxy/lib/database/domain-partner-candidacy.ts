import { fetch, query } from "./common.ts";
import type { DomainPartnerCandidacy, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getDomainPartnerCandidacy(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      SELECT ca.id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        ca.status, ca.created_at, ca.updated_at, ca.expired_at
      FROM domain_partner_candidate ca
        JOIN domain d ON ca.domain_id = d.id
      WHERE ca.id = $2
        AND ca.identity_id = $1`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as DomainPartnerCandidacy[];
}

// -----------------------------------------------------------------------------
export async function listDomainPartnerCandidacy(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql0 = {
    text: `
      DELETE FROM domain_partner_candidate
      WHERE expired_at < now()`,
  };
  await query(sql0);

  const sql = {
    text: `
      SELECT ca.id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        ca.status, ca.created_at, ca.updated_at, ca.expired_at
      FROM domain_partner_candidate ca
        JOIN domain d ON ca.domain_id = d.id
      WHERE ca.identity_id = $1
      ORDER BY status, domain_name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as DomainPartnerCandidacy[];
}

// -----------------------------------------------------------------------------
export async function acceptDomainPartnerCandidacy(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      INSERT INTO domain_partner (identity_id, domain_id)
        VALUES (
          $1,
          (SELECT domain_id
           FROM domain_partner_candidate
           WHERE id = $2
             AND identity_id != $1
          )
        )
        RETURNING id, created_at as at`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  const rows = await fetch(sql) as Id[];

  // remove the domain-partner candidancy
  const sql1 = {
    text: `
        DELETE FROM domain_partner_candidate
        WHERE id = $2
          AND identity_id = $1`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  if (rows[0] !== undefined) await query(sql1);

  return rows;
}

// -----------------------------------------------------------------------------
export async function rejectDomainPartnerCandidacy(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      UPDATE domain_partner_candidate
      SET
        status = 'rejected',
        updated_at = now(),
        expired_at = now() + interval '7 days'
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as Id[];
}
