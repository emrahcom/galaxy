import { fetch } from "./common.ts";
import type { DomainCandidacy } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getDomainCandidacy(
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
      FROM domain_candidate ca
        JOIN domain d ON ca.domain_id = d.id
      WHERE ca.id = $2
        AND ca.identity_id = $1)`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as DomainCandidacy[];
}

// -----------------------------------------------------------------------------
export async function listDomainCandidacy(
  identityId: string,
  limit: number,
  offset: number,
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
      FROM domain_candidate ca
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

  return await fetch(sql) as DomainCandidacy[];
}
