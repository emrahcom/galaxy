import { fetch } from "./common.ts";
import type {
  Id,
  IntercomMessage,
  IntercomMessage222,
  IntercomStatus,
} from "./types.ts";

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
export async function getIntercom(identityId: string, intercomId: string) {
  const sql = {
    text: `
      SELECT ic.id, co.id as contact_id, co.name as contact_name, status,
        message_type, intercom_attr, expired_at
      FROM intercom ic
        JOIN contact co ON co.identity_id = $1
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
export async function listIntercom(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT ic.id, co.id as contact_id, co.name as contact_name, status,
        message_type, intercom_attr, expired_at
      FROM intercom ic
        JOIN contact co ON co.identity_id = $1
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
