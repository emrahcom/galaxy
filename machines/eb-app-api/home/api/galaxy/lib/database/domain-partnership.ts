import { fetch, query } from "./common.ts";
import type { DomainPartnership, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getPartnershipByDomain(
  identityId: string,
  domainId: string,
) {
  const sql = {
    text: `
      SELECT p.id, d.id as domain_id, d.name as domain_name,
        d.domain_attr->>'url' as domain_url, p.enabled,
        p.created_at, p.updated_at
      FROM domain_partner p
        JOIN domain d ON p.domain_id = d.id
      WHERE p.identity_id = $1
        AND p.domain_id = $2`,
    args: [
      identityId,
      domainId,
    ],
  };

  return await fetch(sql) as DomainPartnership[];
}

// -----------------------------------------------------------------------------
export async function addPartnershipByCode(
  identityId: string,
  code: string,
) {
  const sql = {
    text: `
      INSERT INTO domain_partner (identity_id, domain_id)
      VALUES (
        $1,
        (SELECT domain_id
         FROM domain_invite
         WHERE code = $2
           AND enabled = true
           AND expired_at > now())
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      code,
    ],
  };
  const rows = await fetch(sql) as Id[];

  // disable the invite key if the add action is successful
  const sql1 = {
    text: `
      UPDATE domain_invite
      SET
        enabled = false,
        updated_at = now()
      WHERE code = $1`,
    args: [
      code,
    ],
  };
  if (rows[0] !== undefined) await query(sql1);

  return rows;
}

// -----------------------------------------------------------------------------
export async function delPartnership(
  identityId: string,
  partnershipId: string,
) {
  const sql = {
    text: `
      DELETE FROM domain_partner
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      partnershipId,
    ],
  };

  return await fetch(sql) as Id[];
}
