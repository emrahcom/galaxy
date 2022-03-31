import { fetch } from "./common.ts";
import type { Id, MeetingInvite, MeetingInvite111 } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeetingInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      SELECT iv.id, iv.name, m.id as meeting_id, m.name as meeting_name,
        m.info as meeting_info, m.schedule_type as meeting_schedule_type,
        iv.code, iv.invite_to, iv.join_as, iv.disposable, iv.enabled,
        iv.created_at, iv.updated_at, iv.expired_at
      FROM meeting_invite iv
        JOIN meeting m ON iv.meeting_id = m.id
      WHERE iv.id = $2
        AND iv.identity_id = $1
        AND iv.expired_at > now()`,
    args: [
      identityId,
      inviteId,
    ],
  };

  return await fetch(sql) as MeetingInvite[];
}

// -----------------------------------------------------------------------------
export async function getMeetingInviteByCode(code: string) {
  const sql = {
    text: `
      SELECT m.name as meeting_name, m.info as meeting_info, iv.code,
        iv.invite_to
      FROM meeting_invite iv
        JOIN meeting m ON iv.meeting_id = m.id
      WHERE iv.code = $1
        AND iv.enabled
        AND iv.expired_at > now()`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as MeetingInvite111[];
}

// -----------------------------------------------------------------------------
export async function listMeetingInviteByMeeting(
  identityId: string,
  meetingId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT iv.id, iv.name, m.id as meeting_id, m.name as meeting_name,
        m.info as meeting_info, m.schedule_type as meeting_schedule_type,
        iv.code, iv.invite_to, iv.join_as, iv.disposable, iv.enabled,
        iv.created_at, iv.updated_at, iv.expired_at
      FROM meeting_invite iv
        JOIN meeting m ON iv.meeting_id = m.id
      WHERE iv.identity_id = $1
        AND iv.meeting_id = $2
        AND iv.expired_at > now()
      ORDER BY iv.updated_at DESC
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      meetingId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingInvite[];
}

// -----------------------------------------------------------------------------
export async function addMeetingInvite(
  identityId: string,
  meetingId: string,
  name: string,
  inviteTo: string,
  joinAs: string,
  disposable: boolean,
) {
  const sql = {
    text: `
      INSERT INTO meeting_invite (identity_id, meeting_id, name, invite_to,
        join_as, disposable)
      VALUES (
        $1,
        (SELECT id
         FROM meeting
         WHERE id = $2
           AND identity_id = $1
        ),
        $3, $4, $5, $6
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      meetingId,
      name,
      inviteTo,
      joinAs,
      disposable,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delMeetingInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      DELETE FROM meeting_invite
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      inviteId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateMeetingInviteEnabled(
  identityId: string,
  inviteId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE meeting_invite
      SET
        enabled = $3,
        updated_at = now(),
        expired_at = CASE $3::boolean
                       WHEN true THEN now() + interval '3 days'
                       ELSE now() + interval '3 hours'
                     END
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      inviteId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
