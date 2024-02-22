import { fetch } from "./common.ts";
import type { DomainPartner, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getDomainPartner(
  identityId: string,
  partnershipId: string,
) {
  const sql = {
    text: `
      SELECT pa.id, pa.domain_id, co.name ad contact_name,
        pr.name as profile_name, pr.email as profile_email, pa.enabled,
        pa.created_at, pa.updated_at
      FROM domain_partner pa
        LEFT JOIN contact co ON co.identity_id = $1
                                AND co.remote_id = pa.identity_id
        LEFT JOIN profile pr ON pa.identity_id = pr.identity_id
                                AND pr.is_default
      WHERE pa.id = $2
        AND EXISTS (SELECT 1
                    FROM domain
                    WHERE id = pa.domain_id
                      AND identity_id = $1
                   )`,
    args: [
      identityId,
      partnershipId,
    ],
  };

  return await fetch(sql) as DomainPartner[];
}

// -----------------------------------------------------------------------------
export async function listDomainPartnerByDomain(
  identityId: string,
  domainId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT pa.id, pa.domain_id, co.name ad contact_name,
        pr.name as profile_name, pr.email as profile_email, pa.enabled,
        pa.created_at, pa.updated_at
      FROM domain_partner pa
        LEFT JOIN contact co ON co.identity_id = $1
                                AND co.remote_id = pa.identity_id
        LEFT JOIN profile pr ON pa.identity_id = pr.identity_id
                                AND pr.is_default
      WHERE pa.domain_id = $2
        AND EXISTS (SELECT 1
                    FROM domain
                    WHERE id = pa.domain_id
                      AND identity_id = $1
                   )
      ORDER BY profile_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      domainId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as DomainPartner[];
}

// -----------------------------------------------------------------------------
export async function delDomainPartner(
  identityId: string,
  partnershipId: string,
) {
  const sql = {
    text: `
      DELETE FROM domain_partner
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM domain
                    WHERE id = domain_id
                      AND identity_id = $1
                   )
      RETURNING id, now() as at`,
    args: [
      identityId,
      partnershipId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateDomainPartnerEnabled(
  identityId: string,
  partnershipId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE domain_partner
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM domain
                    WHERE id = domain_id
                      AND identity_id = $1
                   )
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      partnershipId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
