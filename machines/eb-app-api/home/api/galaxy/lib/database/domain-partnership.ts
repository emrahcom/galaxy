import { fetch, query } from "./common.ts";
import type { DomainPartnership, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getDomainPartnership(
  identityId: string,
  partnershipId: string,
) {
  const sql = {
    text: `
      SELECT pa.id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        pa.enabled, pa.created_at, pa.updated_at
      FROM domain_partner pa
        JOIN domain d ON pa.domain_id = d.id
      WHERE pa.id = $2
        AND pa.identity_id = $1`,
    args: [
      identityId,
      partnershipId,
    ],
  };

  return await fetch(sql) as DomainPartnership[];
}

// -----------------------------------------------------------------------------
export async function addDomainPartnershipByCode(
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
           AND identity_id != $1
           AND enabled
           AND expired_at > now()
        )
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

  // add partner to the contact list
  const sql2 = {
    text: `
      INSERT INTO contact (identity_id, contact_id, name)
      VALUES (
        (SELECT identity_id
         FROM domain_invite
         WHERE code = $2
        ),
        $1,
        (SELECT name
         FROM profile
         WHERE identity_id = $1
           AND is_default
        )
      )
      ON CONFLICT DO NOTHING`,
    args: [
      identityId,
      code,
    ],
  };
  if (rows[0] !== undefined) await query(sql2);

  return rows;
}

// -----------------------------------------------------------------------------
export async function delDomainPartnership(
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
