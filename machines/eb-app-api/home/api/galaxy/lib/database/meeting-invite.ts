import { fetch } from "./common.ts";
import type { Id, MeetingInvite, MeetingInviteReduced } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeetingInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      SELECT i.id, i.name, m.id as meeting_id, m.name as meeting_name,
        m.info as meeting_info, i.code, i.invite_type, i.join_as, i.disposable,
        i.enabled, i.created_at, i.updated_at, i.expired_at
      FROM meeting_invite i
        JOIN meeting m ON i.meeting_id = m.id
      WHERE i.id = $2
        AND i.identity_id = $1
        AND i.expired_at > now()`,
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
      SELECT m.name as meeting_name, m.info as meeting_info, i.code,
        i.invite_type
      FROM meeting_invite i
        JOIN meeting m ON i.meeting_id = m.id
      WHERE i.code = $1
        AND i.enabled = true
        AND i.expired_at > now()`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as MeetingInviteReduced[];
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
      SELECT i.id, i.name, m.id as meeting_id, m.name as meeting_name,
        m.info as meeting_info, i.code, i.invite_type, i.join_as, i.disposable,
        i.enabled, i.created_at, i.updated_at, i.expired_at
      FROM meeting_invite i
        JOIN meeting m ON i.meeting_id = m.id
      WHERE i.identity_id = $1
        AND i.meeting_id = $2
        AND i.expired_at > now()
      ORDER BY i.updated_at DESC
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
  inviteType: string,
  joinAs: string,
  disposable: boolean,
) {
  const sql = {
    text: `
      INSERT INTO meeting_invite (identity_id, meeting_id, name, invite_type,
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
      inviteType,
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
