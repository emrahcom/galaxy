import { fetch, query } from "./common.ts";
import type { Id, MeetingMemberCandidacy } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeetingMemberCandidacy(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      SELECT ca.id, m.name as meeting_name, m.info as meeting_info,
        m.schedule_type,
        array(SELECT array[started_at, ended_at]
              FROM meeting_schedule
              WHERE meeting_id = m.id
                AND ended_at > now()
              LIMIT 8
             ) as schedule_list,
        ca.join_as, ca.status, ca.created_at, ca.updated_at, ca.expired_at
      FROM meeting_member_candidate ca
        JOIN meeting m ON ca.meeting_id = m.id
      WHERE ca.id = $2
        AND ca.identity_id = $1`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as MeetingMemberCandidacy[];
}

// -----------------------------------------------------------------------------
export async function listMeetingMemberCandidacy(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql0 = {
    text: `
      DELETE FROM meeting_member_candidate
      WHERE expired_at < now()`,
  };
  await query(sql0);

  const sql = {
    text: `
      SELECT ca.id, m.name as meeting_name, m.info as meeting_info,
        m.schedule_type,
        array(SELECT array[started_at, ended_at]
              FROM meeting_schedule
              WHERE meeting_id = m.id
                AND ended_at > now()
              LIMIT 8
             ) as schedule_list,
        ca.join_as, ca.status, ca.created_at, ca.updated_at, ca.expired_at
      FROM meeting_member_candidate ca
        JOIN meeting m ON ca.meeting_id = m.id
      WHERE ca.identity_id = $1
      ORDER BY status, meeting_name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingMemberCandidacy[];
}

// -----------------------------------------------------------------------------
export async function acceptMeetingMemberCandidacy(
  identityId: string,
  profileId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      INSERT INTO meeting_member (identity_id, profile_id, meeting_id, join_as)
      VALUES (
        $1,
        (SELECT id
         FROM profile
         WHERE id = $3
           AND identity_id = $1
        ),
        (SELECT meeting_id
         FROM meeting_member_candidate
         WHERE id = $2
           AND identity_id = $1
        ),
        (SELECT join_as
         FROM meeting_member_candidate
         WHERE id = $2
           AND identity_id = $1
        )
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      candidacyId,
      profileId,
    ],
  };
  const rows = await fetch(sql) as Id[];

  // add member to the contact list if not exists
  const sql1 = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        (SELECT identity_id
         FROM meeting
         WHERE id = (SELECT meeting_id
                     FROM meeting_member_candidate
                     WHERE id = $2
                       AND identity_id = $1
                    )
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
      candidacyId,
    ],
  };
  if (rows[0] !== undefined) await query(sql1);

  // add meeting owner to the partner's contact list if not exists
  const sql2 = {
    text: `
      INSERT INTO contact (identity_id, remote_id, name)
      VALUES (
        $1,
        (SELECT identity_id
         FROM meeting
         WHERE id = (SELECT meeting_id
                     FROM meeting_member_candidate
                     WHERE id = $2
                       AND identity_id = $1
                    )
        ),
        (SELECT name
         FROM profile
         WHERE identity_id = (SELECT identity_id
                              FROM meeting
                              WHERE id = (SELECT meeting_id
                                          FROM meeting_member_candidate
                                          WHERE id = $2
                                            AND identity_id = $1
                                         )
                             )
           AND is_default
        )
      )
      ON CONFLICT DO NOTHING`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  if (rows[0] !== undefined) await query(sql2);

  // remove the meeting-member candidancy if the add action is successful
  const sql3 = {
    text: `
        DELETE FROM meeting_member_candidate
        WHERE id = $2
          AND identity_id = $1`,
    args: [
      identityId,
      candidacyId,
    ],
  };
  if (rows[0] !== undefined) await query(sql3);

  return rows;
}

// -----------------------------------------------------------------------------
export async function rejectMeetingMemberCandidacy(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      UPDATE meeting_member_candidate
      SET
        status = 'rejected',
        updated_at = now(),
        expired_at = now() + interval '7 days'
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as Id[];
}
