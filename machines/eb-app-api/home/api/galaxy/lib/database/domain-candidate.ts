import { fetch, query } from "./common.ts";
import type { DomainCandidate, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getDomainCandidate(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      SELECT ca.id, ca.domain_id, co.name as contact_name,
        pr.name as profile_name, pr.email as profile_email, ca.status,
        ca.created_at, ca.updated_at, ca.expired_at
      FROM domain_candidate ca
        LEFT JOIN contact co ON co.identity_id = $1
                                AND co.remote_id = ca.identity_id
        LEFT JOIN profile pr ON ca.identity_id = pr.identity_id
                                AND pr.is_default
      WHERE ca.id = $2
        AND EXISTS (SELECT 1
                    FROM domain
                    WHERE id = ca.domain_id
                      AND identity_id = $1
                   )`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as DomainCandidate[];
}

// -----------------------------------------------------------------------------
export async function listDomainCandidateByDomain(
  identityId: string,
  domainId: string,
  limit: number,
  offset: number,
) {
  const sql0 = {
    text: `
      DELETE FROM domain_candidate
      WHERE expired_at > now()`,
  };
  await query(sql0);

  const sql = {
    text: `
      SELECT ca.id, ca.domain_id, co.name as contact_name,
        pr.name as profile_name, pr.email as profile_email, ca.status,
        ca.created_at, ca.updated_at, ca.expired_at
      FROM domain_candidate ca
        LEFT JOIN contact co ON co.identity_id = $1
                                AND co.remote_id = ca.identity_id
        LEFT JOIN profile pr ON ca.identity_id = pr.identity_id
                                AND pr.is_default
      WHERE ca.domain_id = $2
        AND EXISTS (SELECT 1
                    FROM domain
                    WHERE id = ca.domain_id
                      AND identity_id = $1
                   )
      ORDER BY contact_name, profile_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      domainId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as DomainCandidate[];
}

// -----------------------------------------------------------------------------
export async function addDomainCandidate(
  identityId: string,
  domainId: string,
  contactId: string,
) {
  const sql = {
    text: `
      INSERT INTO domain_candidate (identity_id, domain_id)
      VALUES (
        (SELECT remote_id
         FROM contact
         WHERE id = $3
           AND identity_id = $1
        ),
        (SELECT id
         FROM domain
         WHERE id = $2
           AND identity_id = $1
        )
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      domainId,
      contactId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delDomainCandidate(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      DELETE FROM domain_candidate
      WHERE id = $2
        AND status = 'pending'
        AND EXISTS (SELECT 1
                    FROM domain
                    WHERE id = domain_id
                      AND identity_id = $1
                   )
      RETURNING id, now() as at`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as Id[];
}
