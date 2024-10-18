import { fetch, pool } from "./common.ts";
import type { Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function checkContactFriendshipByCode(
  identityId: string,
  code: string,
) {
  const sql = {
    text: `
      SELECT id, created_at as at
      FROM contact
      WHERE identity_id = $1
        AND remote_id = (SELECT identity_id
                         FROM contact_invite
                         WHERE code = $2
                        )`,
    args: [
      identityId,
      code,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function addContactFriendshipByCode(
  identityId: string,
  code: string,
  name: string,
) {
  using client = await pool.connect();
  const trans = client.createTransaction("transaction");
  await trans.begin();

  // add the inviter to the invitee's contact list
  const sql = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        $1,
        (SELECT identity_id
         FROM contact_invite
         WHERE code = $2
        ),
        $3
      )
      ON CONFLICT DO NOTHING
      RETURNING id, created_at as at`,
    args: [
      identityId,
      code,
      name,
    ],
  };
  const { rows: rows } = await trans.queryObject(sql);

  // add the invitee to the inviter's contact list
  const sql1 = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        (SELECT identity_id
         FROM contact_invite
         WHERE code = $2
        ),
        $1,
        (SELECT name
         FROM profile
         WHERE identity_id = $1
           AND is_default
        )
      )
      ON CONFLICT DO NOTHING`,
    args: [
      identityId,
      code,
    ],
  };
  await trans.queryObject(sql1);

  // disable the invite key if the add action is successful
  // don't disable undisposable keys
  const sql2 = {
    text: `
      UPDATE contact_invite
      SET
        enabled = false,
        updated_at = now()
      WHERE code = $1
        AND disposable`,
    args: [
      code,
    ],
  };
  await trans.queryObject(sql2);

  await trans.commit();

  return rows as Id[];
}
