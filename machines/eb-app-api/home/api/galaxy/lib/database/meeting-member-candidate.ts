import { fetch } from "./common.ts";
import type { Id, MeetingMemberCandidate } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeetingMemberCandidate(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      SELECT ca.id, ca.meeting_id, co.name as contact_name,
        pr.name as profile_name, pr.email as profile_email, ca.join_as,
        ca.status, ca.created_at, ca.updated_at, ca.expired_at
      FROM meeting_member_candidate ca
        LEFT JOIN contact co ON co.identity_id = $1
                                AND co.remote_id = ca.identity_id
        LEFT JOIN profile pr ON ca.identity_id = pr.identity_id
                                AND pr.is_default
      WHERE ca.id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = ca.meeting_id
                      AND identity_id = $1
                   )`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as MeetingMemberCandidate[];
}

// -----------------------------------------------------------------------------
export async function listMeetingMemberCandidateByMeeting(
  identityId: string,
  meetingId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT ca.id, ca.meeting_id, co.name as contact_name,
        pr.name as profile_name, pr.email as profile_email, ca.join_as,
        ca.status, ca.created_at, ca.updated_at, ca.expired_at
      FROM meeting_member_candidate ca
        LEFT JOIN contact co ON co.identity_id = $1
                                AND co.remote_id = ca.identity_id
        LEFT JOIN profile pr ON ca.identity_id = pr.identity_id
                                AND pr.is_default
      WHERE ca.meeting_id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = ca.meeting_id
                      AND identity_id = $1
                   )
      ORDER BY status, contact_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      meetingId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingMemberCandidate[];
}

// -----------------------------------------------------------------------------
export async function addMeetingMemberCandidate(
  identityId: string,
  meetingId: string,
  contactId: string,
  joinAs: string,
) {
  const sql = {
    text: `
      INSERT INTO meeting_member_candidate (identity_id, meeting_id, join_as)
      VALUES (
        (SELECT remote_id
         FROM contact
         WHERE id = $3
           AND identity_id = $1
        ),
        (SELECT id
         FROM meeting
         WHERE id = $2
           AND identity_id = $1
        ),
        $4
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      meetingId,
      contactId,
      joinAs,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delMeetingMemberCandidate(
  identityId: string,
  candidacyId: string,
) {
  const sql = {
    text: `
      DELETE FROM meeting_member_candidate
      WHERE id = $2
        AND status = 'pending'
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, now() as at`,
    args: [
      identityId,
      candidacyId,
    ],
  };

  return await fetch(sql) as Id[];
}
