import { fetch } from "./common.ts";
import type { Id, MeetingMembership } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeetingMembershipByMeeting(
  identityId: string,
  meetingId: string,
) {
  const sql = {
    text: `
      SELECT mem.id, p.id as profile_id, p.name as profile_name,
        p.email as profile_email, m.name as meeting_name,
        m.info as meeting_info, mem.join_as, mem.enabled, mem.created_at,
        mem.updated_at
      FROM meeting_member mem
        JOIN meeting m ON mem.meeting_id = m.id
        JOIN profile p ON mem.profile_id = p.id
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
         FROM meeting_invite
         WHERE code = $3
           AND enabled = true
           AND expired_at > now()
        ),
        (SELECT join_as
         FROM meeting_invite
         WHERE code = $3
           AND enabled = true
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

  return await fetch(sql) as Id[];
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
