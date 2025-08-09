import { fetch } from "./common.ts";
import type {
  Attr,
  Id,
  IntercomMessage,
  IntercomMessage222,
  IntercomStatus,
} from "./types.ts";

const SYSTEM_ACCOUNT = "00000000-0000-0000-0000-000000000000";

// -----------------------------------------------------------------------------
// Consumer is the caller who creates the record.
// -----------------------------------------------------------------------------
export async function getIntercomForOwner(
  identityId: string,
  intercomId: string,
) {
  const sql = {
    text: `
      SELECT id, remote_id, status, message_type, intercom_attr, expired_at
      FROM intercom
      WHERE id = $2
        AND identity_id = $1`,
    args: [
      identityId,
      intercomId,
    ],
  };

  return await fetch(sql) as IntercomMessage[];
}

// -----------------------------------------------------------------------------
// Consumer is the callee.
// -----------------------------------------------------------------------------
export async function getIntercom(identityId: string, intercomId: string) {
  // There will be no contact if this call is from a public phone.
  // ic.identity_id is the system user in this case.
  const sql = {
    text: `
      SELECT ic.id, co.name as contact_name, ic.status, ic.message_type,
        ic.intercom_attr, ic.created_at, ic.expired_at
      FROM intercom ic
        LEFT JOIN contact co ON co.identity_id = ic.remote_id
                                AND co.remote_id = ic.identity_id
      WHERE ic.id = $2
        AND ic.remote_id = $1`,
    args: [
      identityId,
      intercomId,
    ],
  };

  return await fetch(sql) as IntercomMessage222[];
}

// -----------------------------------------------------------------------------
// Consumer is a public user by using a public phone code.
// -----------------------------------------------------------------------------
export async function getIntercomAttrByCode(code: string, intercomId: string) {
  const sql = {
    text: `
      SELECT intercom_attr->>'public_url' as public_url
      FROM intercom
      WHERE id = $2
        AND identity_id = $3
        AND status = 'accepted'
        AND remote_id = (SELECT identity_id
                         FROM phone
                         WHERE code = $1
                        )`,
    args: [
      code,
      intercomId,
      SYSTEM_ACCOUNT,
    ],
  };

  return await fetch(sql) as Attr[];
}

// -----------------------------------------------------------------------------
// Consumer is the callee.
// -----------------------------------------------------------------------------
export async function listIntercom(
  identityId: string,
  epoch: number,
  limit: number,
  offset: number,
) {
  // There will be no contact if the call is from a public phone.
  // ic.identity_id is the system user in this case.
  const sql = {
    text: `
      SELECT ic.id, co.name as contact_name, ic.status, ic.message_type,
        CASE
          WHEN ic.message_type = 'text' THEN
            jsonb_build_object(
              'message', convert_from(
                           decode(ic.intercom_attr->>'message', 'base64'),
                           'UTF8'
                         )
            )
          ELSE ic.intercom_attr
        END AS intercom_attr,
        ic.created_at, ic.expired_at
      FROM intercom ic
        LEFT JOIN contact co ON co.identity_id = ic.remote_id
                                AND co.remote_id = ic.identity_id
      WHERE ic.remote_id = $1
        AND ic.expired_at > now()
        AND ic.status = 'none'
        AND (
          ic.message_type != 'text' OR
          ic.created_at > to_timestamp($2)
        )
      ORDER BY
        CASE ic.message_type
          WHEN 'call' THEN 1
          WHEN 'phone' THEN 1
          WHEN 'text' THEN 2
          ELSE 3
        END,
        ic.created_at
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      epoch,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as IntercomMessage222[];
}

// -----------------------------------------------------------------------------
// Consumer is the callee with an identity key.
// -----------------------------------------------------------------------------
export async function listIntercomByKey(
  keyValue: string,
  epoch: number,
  limit: number,
  offset: number,
) {
  // There will be no contact if the call is from a public phone.
  // ic.identity_id is the system user in this case.
  const sql = {
    text: `
      SELECT ic.id, co.name as contact_name, ic.status, ic.message_type,
        CASE
          WHEN ic.message_type = 'text' THEN
            jsonb_build_object(
              'message', convert_from(
                           decode(ic.intercom_attr->>'message', 'base64'),
                           'UTF8'
                         )
            )
          ELSE ic.intercom_attr
        END AS intercom_attr,
        ic.created_at, ic.expired_at
      FROM intercom ic
        LEFT JOIN contact co ON co.identity_id = ic.remote_id
                                AND co.remote_id = ic.identity_id
      WHERE ic.remote_id = (SELECT identity_id
                            FROM identity_key
                            WHERE value = $1
                              AND enabled
                           )
        AND ic.expired_at > now()
        AND ic.status = 'none'
        AND (
          ic.message_type != 'text' OR
          ic.created_at > to_timestamp($2)
        )
      ORDER BY
        CASE ic.message_type
          WHEN 'call' THEN 1
          WHEN 'phone' THEN 1
          WHEN 'text' THEN 2
          ELSE 3
        END,
        ic.created_at
      LIMIT $3 OFFSET $4`,
    args: [
      keyValue,
      epoch,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as IntercomMessage222[];
}

// -----------------------------------------------------------------------------
// Consumer is the caller who creates the record.
// -----------------------------------------------------------------------------
export async function delIntercom(identityId: string, intercomId: string) {
  const sql = {
    text: `
      DELETE FROM intercom
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      intercomId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
// Consumer is the caller with an identity key.
// -----------------------------------------------------------------------------
export async function delIntercomByKey(keyValue: string, intercomId: string) {
  const sql = {
    text: `
      DELETE FROM intercom
      WHERE id = $2
        AND identity_id = (SELECT identity_id
                           FROM identity_key
                           WHERE value = $1
                             AND enabled
                          )
      RETURNING id, now() as at`,
    args: [
      keyValue,
      intercomId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
// Consumer is a public user with a public phone code.
// -----------------------------------------------------------------------------
export async function delIntercomByCode(code: string, intercomId: string) {
  const sql = {
    text: `
      DELETE FROM intercom
      WHERE id = $2
        AND identity_id = $3
        AND remote_id = (SELECT identity_id
                         FROM phone
                         WHERE code = $1
                        )
      RETURNING id, now() as at`,
    args: [
      code,
      intercomId,
      SYSTEM_ACCOUNT,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
// Consumer is the callee.
// -----------------------------------------------------------------------------
export async function setStatusIntercom(
  identityId: string,
  intercomId: string,
  status: IntercomStatus,
) {
  const sql = {
    text: `
      UPDATE intercom
      SET status = $3
      WHERE id = $2
        AND remote_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      intercomId,
      status,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
// Consumer is the callee with an identity key.
// -----------------------------------------------------------------------------
export async function setStatusIntercomByKey(
  keyValue: string,
  intercomId: string,
  status: IntercomStatus,
) {
  const sql = {
    text: `
      UPDATE intercom
      SET status = $3
      WHERE id = $2
        AND remote_id = (SELECT identity_id
                         FROM identity_key
                         WHERE value = $1
                           AND enabled
                        )
      RETURNING id, now() as at`,
    args: [
      keyValue,
      intercomId,
      status,
    ],
  };

  return await fetch(sql) as Id[];
}
