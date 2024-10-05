import { fetch } from "./common.ts";
import type { IntercomMessage } from "./types.ts";

// -----------------------------------------------------------------------------
export async function listIntercom(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT ic.id, co.id as contact_id, co.name as contact_name, message_type,
        intercom_attr
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

  return await fetch(sql) as IntercomMessage[];
}
