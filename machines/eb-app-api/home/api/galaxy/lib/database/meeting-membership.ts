import { fetch, query } from "./common.ts";
import type { Id, MeetingMembership } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeetingMembership(
  identityId: string,
  membershipId: string,
) {
  const sql = {
    text: `
      SELECT mem.id, pr.id as profile_id, pr.name as profile_name,
        pr.email as profile_email, m.name as meeting_name,
        m.info as meeting_info, mem.join_as, mem.enabled, mem.created_at,
        mem.updated_at
      FROM meeting_member mem
        JOIN meeting m ON mem.meeting_id = m.id
        JOIN profile pr ON mem.profile_id = pr.id
      WHERE mem.id = $2
        AND mem.identity_id = $1`,
    args: [
      identityId,
      membershipId,
    ],
  };

  return await fetch(sql) as MeetingMembership[];
}

// -----------------------------------------------------------------------------
export async function addMeetingMembershipByCode(
  identityId: string,
  profileId: string,
  code: string,
) {
  const sql = {
    text: `
      INSERT INTO meeting_member (identity_id, profile_id, meeting_id,
        join_as)
      VALUES (
        $1,
        (SELECT id
         FROM profile
         WHERE id = $2
           AND identity_id = $1
        ),
        (SELECT meeting_id
         FROM meeting_invite iv
           JOIN meeting m ON iv.meeting_id = m.id
         WHERE iv.code = $3
           AND iv.enabled
           AND iv.invite_to = 'member'
           AND iv.expired_at > now()
           AND m.schedule_type != 'ephemeral'
        ),
        (SELECT join_as
         FROM meeting_invite
         WHERE code = $3
           AND enabled
           AND invite_to = 'member'
           AND expired_at > now()
        )
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      profileId,
      code,
    ],
  };
  const rows = await fetch(sql) as Id[];

  // disable the invite key if the add action is successful
  // don't disable audience keys and undisposable keys
  const sql1 = {
    text: `
      UPDATE meeting_invite
      SET
        enabled = false,
        updated_at = now()
      WHERE code = $1
        AND invite_to = 'member'
        AND disposable`,
    args: [
      code,
    ],
  };
  if (rows[0] !== undefined) await query(sql1);

  // add partner to the contact list
  const sql2 = {
    text: `
      INSERT INTO contact (identity_id, contact_id, name)
      VALUES (
        (SELECT identity_id
         FROM meeting_invite
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
  if (rows[0] !== undefined) await query(sql2);

  // add meeting owner to the partner's contact list
  const sql3 = {
    text: `
      INSERT INTO contact (identity_id, contact_id, name)
      VALUES (
        $1,
        (SELECT identity_id
         FROM meeting_invite
         WHERE code = $2
        ),
        (SELECT name
         FROM profile
         WHERE identity_id = (SELECT identity_id
                              FROM meeting_invite
                              WHERE code = $2
                             )
           AND is_default
        )
      )
      ON CONFLICT DO NOTHING`,
    args: [
      identityId,
      code,
    ],
  };
  if (rows[0] !== undefined) await query(sql3);

  return rows;
}

// -----------------------------------------------------------------------------
export async function delMeetingMembership(
  identityId: string,
  membershipId: string,
) {
  const sql = {
    text: `
      DELETE FROM meeting_member
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      membershipId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateMeetingMembership(
  identityId: string,
  membershipId: string,
  profileId: string,
) {
  // meeting_id is not updatable
  const sql = {
    text: `
      UPDATE meeting_member
      SET
        profile_id= (SELECT id
                     FROM profile
                     WHERE id = $3
                       AND identity_id = $1
                    ),
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      membershipId,
      profileId,
    ],
  };

  return await fetch(sql) as Id[];
}
