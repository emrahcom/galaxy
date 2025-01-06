import { fetch } from "./common.ts";
import type { Id, IdentityKey } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getIdentityKey(identityId: string, keyId: string) {
  const sql = {
    text: `
      SELECT ik.id, ik.name, ik.code, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
        ) as domain_url,
        ik.enabled,
        (d.enabled AND i.enabled
         AND CASE d.identity_id
               WHEN $1 THEN true
               ELSE CASE d.public
                      WHEN true THEN true
                      ELSE (SELECT enabled
                            FROM domain_partner
                            WHERE identity_id = $1
                              AND domain_id = d.id
                           )
                    END
             END
        ) as chain_enabled,
        ik.created_at, ik.updated_at
      FROM identity_key ik
        JOIN domain d ON ik.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE ik.id = $2
        AND ik.identity_id = $1`,
    args: [
      identityId,
      keyId,
    ],
  };

  return await fetch(sql) as IdentityKey[];
}

// -----------------------------------------------------------------------------
export async function listIdentityKey(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT ik.id, ik.name, ik.code, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
        ) as domain_url,
        ik.enabled,
        (d.enabled AND i.enabled
         AND CASE d.identity_id
               WHEN $1 THEN true
               ELSE CASE d.public
                      WHEN true THEN true
                      ELSE (SELECT enabled
                            FROM domain_partner
                            WHERE identity_id = $1
                              AND domain_id = d.id
                           )
                    END
             END
        ) as chain_enabled,
        ik.created_at, ik.updated_at
      FROM identity_key ik
        JOIN domain d ON ik.domain_id = d.id
      WHERE ik.identity_id = $1
      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as IdentityKey[];
}

// -----------------------------------------------------------------------------
export async function addIdentityKey(
  identityId: string,
  domainId: string,
  name: string,
) {
  const sql = {
    text: `
      INSERT INTO identity_key (identity_id, domain_id, name)
      VALUES (
        $1,
        (SELECT id
         FROM domain d
         WHERE id = $2
           AND (identity_id = $1
                OR public
                OR EXISTS (SELECT 1
                           FROM domain_partner
                           WHERE identity_id = $1
                             AND domain_id = d.id
                          )
               )
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
export async function delIdentityKey(identityId: string, keyId: string) {
  const sql = {
    text: `
      DELETE FROM identity_key
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      keyId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateIdentityKey(
  identityId: string,
  keyId: string,
  domainId: string,
  name: string,
) {
  const sql = {
    text: `
      UPDATE identity_key
      SET
        domain_id = (SELECT id
                     FROM domain d
                     WHERE id = $3
                       AND (identity_id = $1
                            OR public
                            OR EXISTS (SELECT 1
                                       FROM domain_partner
                                       WHERE identity_id = $1
                                         AND domain_id = d.id
                                      )
                           )
                    ),
        name = $4,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      keyId,
      domainId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateIdentityKeyEnabled(
  identityId: string,
  keyId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE identity_key
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      keyId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
