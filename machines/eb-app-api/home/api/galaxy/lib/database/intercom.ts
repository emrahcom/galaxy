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
      SELECT ic.id, co.name as contact_name, status, message_type,
        intercom_attr, expired_at
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
  limit: number,
  offset: number,
) {
  // There will be no contact if the call is from a public phone.
  // ic.identity_id is the system user in this case.
  const sql = {
    text: `
      SELECT ic.id, co.name as contact_name, status, message_type,
        intercom_attr, expired_at
      FROM intercom ic
        LEFT JOIN contact co ON co.identity_id = ic.remote_id
                                AND co.remote_id = ic.identity_id
      WHERE ic.remote_id = $1
        AND expired_at > now()
        AND status = 'none'
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as IntercomMessage222[];
}

// -----------------------------------------------------------------------------
// Consumer is the callee with an identity key.
// -----------------------------------------------------------------------------
export async function listIntercomByCode(
  code: string,
  limit: number,
  offset: number,
) {
  // There will be no contact if the call is from a public phone.
  // ic.identity_id is the system user in this case.
  const sql = {
    text: `
      SELECT ic.id, co.name as contact_name, status, message_type,
        intercom_attr, expired_at
      FROM intercom ic
        LEFT JOIN contact co ON co.identity_id = ic.remote_id
                                AND co.remote_id = ic.identity_id
      WHERE ic.remote_id = (SELECT identity_id
                            FROM identity_key
                            WHERE code = $1
                              AND enabled)
        AND expired_at > now()
        AND status = 'none'
      LIMIT $2 OFFSET $3`,
    args: [
      code,
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
export async function setStatusIntercomByCode(
  code: string,
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
                         WHERE code = $1
                           AND enabled)
      RETURNING id, now() as at`,
    args: [
      code,
      intercomId,
      status,
    ],
  };

  return await fetch(sql) as Id[];
}
