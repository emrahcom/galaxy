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
