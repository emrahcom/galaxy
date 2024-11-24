import { fetch } from "./common.ts";
import type { Attr, Id, IntercomRing } from "./types.ts";

const SYSTEM_ACCOUNT = "00000000-0000-0000-0000-000000000000";

// -----------------------------------------------------------------------------
export async function addCall(
  identityId: string,
  remoteId: string,
  callAttr: Attr,
) {
  const sql = {
    text: `
      INSERT INTO intercom (identity_id, remote_id, status, message_type,
        intercom_attr)
      VALUES ($1, $2, 'none', 'call', $3::jsonb)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      remoteId,
      callAttr,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
// consumer is public
// -----------------------------------------------------------------------------
export async function addPhoneCall(code: string, callAttr: Attr) {
  const sql = {
    text: `
      INSERT INTO intercom (identity_id, remote_id, status, message_type,
        intercom_attr)
      VALUES (
        $2,
        (SELECT identity_id
         FROM phone ph
           JOIN domain d ON ph.domain_id = d.id
                            AND d.enabled
         WHERE code = $1
           AND ph.enabled
        ),
        'none', 'phone', $3::jsonb)
      RETURNING id, created_at as at`,
    args: [
      code,
      SYSTEM_ACCOUNT,
      callAttr,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function ringCall(identityId: string, intercomId: string) {
  const sql = {
    text: `
      UPDATE intercom
      SET
        expired_at = now() + interval '10 seconds'
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, status`,
    args: [
      identityId,
      intercomId,
    ],
  };

  return await fetch(sql) as IntercomRing[];
}

// -----------------------------------------------------------------------------
export async function ringPhone(code: string, intercomId: string) {
  const sql = {
    text: `
      UPDATE intercom
      SET
        expired_at = now() + interval '10 seconds'
      WHERE id = $2
        AND identity_id = $3
        AND remote_id = (SELECT identity_id
                         FROM phone ph
                           JOIN domain d ON ph.domain_id = d.id
                                            AND d.enabled
                         WHERE code = $1
                           AND ph.enabled
                        )
      RETURNING id, status`,
    args: [
      code,
      intercomId,
      SYSTEM_ACCOUNT,
    ],
  };

  return await fetch(sql) as IntercomRing[];
}
