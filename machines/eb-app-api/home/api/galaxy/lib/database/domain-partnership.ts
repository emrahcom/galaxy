import { fetch } from "./common.ts";
import type { Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function addPartnership(
  identityId: string,
  code: string,
) {
  const sql = {
    text: `
      INSERT INTO domain_partner (identity_id, domain_id)
      VALUES (
        $1,
        (SELECT domain_id
         FROM domain_invite
         WHERE code = $2
           AND enabled = true
           AND expired_at > now())
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      code,
    ],
  };
  const rows = await fetch(sql) as Id[];

  // disable the invite key if the add action is successful
  const sql1 = {
    text: `
      UPDATE domain_invite
      SET
        enabled = false,
        updated_at = now()
      WHERE code = $1`,
    args: [
      code,
    ],
  };
  if (rows[0] !== undefined) await query(sql1);

  return rows;
}
