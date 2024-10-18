import { fetch, pool } from "./common.ts";
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
  using client = await pool.connect();
  const trans = client.createTransaction("transaction");
  await trans.begin();

  const sql = {
    text: `
      INSERT INTO domain_partner (identity_id, domain_id)
      VALUES (
        $1,
        (SELECT domain_id
         FROM domain_partner_candidate
         WHERE id = $2
           AND identity_id = $1
        )
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  const { rows: rows } = await trans.queryObject(sql);

  // add the inviter (owner) to the invitee's (partner's) contact list
  const sql1 = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        $1,
        (SELECT identity_id
         FROM domain
         WHERE id = (SELECT domain_id
                     FROM domain_partner_candidate
                     WHERE id = $2
                       AND identity_id = $1
                    )
        ),
        (SELECT name
         FROM profile
         WHERE identity_id = (SELECT identity_id
                              FROM domain
                              WHERE id = (SELECT domain_id
                                          FROM domain_partner_candidate
                                          WHERE id = $2
                                            AND identity_id = $1
                                         )
                             )
           AND is_default
        )
      )
      ON CONFLICT DO NOTHING`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  await trans.queryObject(sql1);

  // add the invitee (partner) to the inviter's (owner's) contact list
  const sql2 = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        (SELECT identity_id
         FROM domain
         WHERE id = (SELECT domain_id
                     FROM domain_partner_candidate
                     WHERE id = $2
                       AND identity_id = $1
                    )
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
      candidacyId,
    ],
  };
  await trans.queryObject(sql2);

  // remove the domain-partner candidancy if the add action is successful
  const sql3 = {
    text: `
        DELETE FROM domain_partner_candidate
        WHERE id = $2
          AND identity_id = $1`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  await trans.queryObject(sql3);

  await trans.commit();

  return rows as Id[];
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
