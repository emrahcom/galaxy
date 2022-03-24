import { fetch } from "./common.ts";
import type { Id, MeetingMember } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMember(identityId: string, membershipId: string) {
  const sql = {
    text: `
      SELECT mem.id, p.name as profile_name, mem.affiliation, mem.enabled,
        mem.created_at, mem.updated_at
      FROM meeting_member mem
        JOIN profile p ON mem.profile_id = p.id
      WHERE mem.id = $2
        AND EXISTS (SELECT 1
                    FROM meeting m
                    WHERE m.id = mem.meeting_id
                      AND m.identity_id = $1
                   )`,
    args: [
      identityId,
      membershipId,
    ],
  };

  return await fetch(sql) as MeetingMember[];
}

// -----------------------------------------------------------------------------
export async function listMember(
  identityId: string,
  meetingId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT mem.id, p.name as profile_name, mem.affiliation, mem.enabled,
        mem.created_at, mem.updated_at
      FROM meeting_member mem
        JOIN profile p ON mem.profile_id = p.id
      WHERE mem.meeting_id = $2
        AND EXISTS (SELECT 1
                    FROM meeting m
                    WHERE m.id = mem.meeting_id
                      AND m.identity_id = $1
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
export async function delMember(identityId: string, membershipId: string) {
  const sql = {
    text: `
      DELETE FROM meeting_member mem
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting m
                    WHERE m.id = mem.meeting_id
                      AND m.identity_id = $1
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
export async function updateMemberEnabled(
  identityId: string,
  membershipId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE meeting_member mem
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting m
                    WHERE m.id = mem.meeting_id
                      AND m.identity_id = $1
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
export async function updateMemberIsHost(
  identityId: string,
  membershipId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE meeting_member mem
      SET
        affiliation = $3,
        updated_at = now()
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting m
                    WHERE m.id = mem.meeting_id
                      AND m.identity_id = $1
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
