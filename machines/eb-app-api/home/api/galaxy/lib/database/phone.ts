import { fetch } from "./common.ts";
import { addPhoneCall } from "../database/intercom-call.ts";
import type { Id, Phone, Phone111, Phone333 } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getPhone(identityId: string, phoneId: string) {
  const sql = {
    text: `
      SELECT ph.id, ph.name, ph.code, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        d.enabled as domain_enabled,
        pr.id as profile_id, pr.name as profile_name, pr.email as profile_email,
        ph.email_enabled, ph.enabled, ph.created_at, ph.updated_at, ph.called_at
      FROM phone ph
        JOIN domain d ON ph.domain_id = d.id
        JOIN profile pr ON ph.profile_id = pr.id
      WHERE ph.id = $2
        AND ph.identity_id = $1`,
    args: [
      identityId,
      phoneId,
    ],
  };

  return await fetch(sql) as Phone[];
}

// -----------------------------------------------------------------------------
export async function getPhoneByCode(code: string) {
  const sql = {
    text: `
      SELECT pr.name as profile_name, pr.email as profile_email, ph.code
      FROM phone ph
        JOIN identity i ON ph.identity_id = i.id
                           AND i.enabled
        JOIN domain d ON ph.domain_id = d.id
                         AND d.enabled
        JOIN profile pr ON ph.profile_id = pr.id
      WHERE ph.code = $1
        AND ph.enabled`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as Phone111[];
}

// -----------------------------------------------------------------------------
export async function getPhonePrivatesByCode(code: string) {
  const sql = {
    text: `
      SELECT ph.name
      FROM phone ph
        JOIN identity i ON ph.identity_id = i.id
                           AND i.enabled
        JOIN domain d ON ph.domain_id = d.id
                         AND d.enabled
      WHERE ph.code = $1
        AND ph.enabled`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as Phone333[];
}

// -----------------------------------------------------------------------------
export async function listPhone(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT ph.id, ph.name, ph.code, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        d.enabled as domain_enabled,
        pr.id as profile_id, pr.name as profile_name, pr.email as profile_email,
        ph.email_enabled, ph.enabled, ph.created_at, ph.updated_at, ph.called_at
      FROM phone ph
        JOIN domain d ON ph.domain_id = d.id
        JOIN profile pr ON ph.profile_id = pr.id
      WHERE ph.identity_id = $1
      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Phone[];
}

// -----------------------------------------------------------------------------
export async function addPhone(
  identityId: string,
  profileId: string,
  domainId: string,
  name: string,
) {
  const sql = {
    text: `
      INSERT INTO phone (identity_id, profile_id, domain_id, name)
      VALUES (
        $1,
        (SELECT id
         FROM profile
         WHERE id = $2
           AND identity_id = $1
        ),
        (SELECT id
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
        $4
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      profileId,
      domainId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delPhone(identityId: string, phoneId: string) {
  const sql = {
    text: `
      DELETE FROM phone
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      phoneId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updatePhone(
  identityId: string,
  phoneId: string,
  profileId: string,
  domainId: string,
  name: string,
) {
  const sql = {
    text: `
      UPDATE phone
      SET
        profile_id = (SELECT id
                      FROM profile
                      WHERE id = $3
                        AND identity_id = $1
                     ),
        domain_id = (SELECT id
                     FROM domain d
                     WHERE id = $4
                       AND (identity_id = $1
                            OR public
                            OR EXISTS (SELECT 1
                                       FROM domain_partner
                                       WHERE identity_id = $1
                                         AND domain_id = d.id
                                      )
                           )
                    ),
        name = $5,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      phoneId,
      profileId,
      domainId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updatePhoneEnabled(
  identityId: string,
  phoneId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE phone
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      phoneId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function callPhoneByCode(code: string) {
  const ownerUrl = "owner";
  const publicUrl = "public";

  // Public URL will be visible to the public user when the call is accepted by
  // the owner.
  const callAttr = {
    url: ownerUrl,
    publicUrl: publicUrl,
  };

  return await addPhoneCall(code, callAttr);
}
