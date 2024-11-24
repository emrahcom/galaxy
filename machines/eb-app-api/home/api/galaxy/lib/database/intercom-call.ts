import { fetch } from "./common.ts";
import type { Attr, Id, IntercomRing } from "./types.ts";

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
  const systemAccount = "00000000-0000-0000-0000-000000000000";

  // Dont return the actual Id to the public user.
  // Return code as Id which is already known by her.
  const sql = {
    text: `
      INSERT INTO intercom (identity_id, remote_id, status, message_type,
        intercom_attr)
      VALUES (
        $1,
        (SELECT identity_id
         FROM phone
         WHERE code = $2
        ),
        'none', 'phone', $3::jsonb)
      RETURNING $2 as id, created_at as at`,
    args: [
      systemAccount,
      code,
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
