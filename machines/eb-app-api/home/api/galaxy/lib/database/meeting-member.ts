import { fetch } from "./common.ts";
import type { Id, MeetingMember } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeetingMember(
  identityId: string,
  membershipId: string,
) {
  const sql = {
    text: `
      SELECT mem.id, mem.meeting_id, pr.name as profile_name,
        pr.email as profile_email, mem.join_as, mem.enabled, mem.created_at,
        mem.updated_at
      FROM meeting_member mem
        JOIN profile pr ON mem.profile_id = pr.id
      WHERE mem.id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = mem.meeting_id
                      AND identity_id = $1
                   )`,
    args: [
      identityId,
      membershipId,
    ],
  };

  return await fetch(sql) as MeetingMember[];
}

// -----------------------------------------------------------------------------
export async function listMeetingMemberByMeeting(
  identityId: string,
  meetingId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT mem.id, mem.meeting_id, pr.name as profile_name,
        pr.email as profile_email, mem.join_as, mem.enabled, mem.created_at,
        mem.updated_at
      FROM meeting_member mem
        JOIN profile pr ON mem.profile_id = pr.id
      WHERE mem.meeting_id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = mem.meeting_id
                      AND identity_id = $1
                   )
      ORDER BY profile_name, mem.created_at
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      meetingId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingMember[];
}

// -----------------------------------------------------------------------------
export async function delMeetingMember(
  identityId: string,
  membershipId: string,
) {
  const sql = {
    text: `
      DELETE FROM meeting_member
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, now() as at`,
    args: [
      identityId,
      membershipId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateMeetingMemberEnabled(
  identityId: string,
  membershipId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE meeting_member
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      membershipId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateMeetingMemberJoinAs(
  identityId: string,
  membershipId: string,
  value: string,
) {
  const sql = {
    text: `
      UPDATE meeting_member
      SET
        join_as = $3,
        updated_at = now()
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      membershipId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
