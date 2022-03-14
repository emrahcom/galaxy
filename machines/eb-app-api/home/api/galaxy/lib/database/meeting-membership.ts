import { fetch } from "./common.ts";
import type { Id, MeetingMembership } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMembership(
  identityId: string,
  membershipId: string,
) {
  const sql = {
    text: `
      SELECT mem.id, mem.profile_id, m.id as meeting_id,
        m.name as meeting_name, m.info as meeting_info, mem.is_host,
        mem.enabled, mem.created_at, mem.updated_at
      FROM membership mem
        JOIN meeting m ON mem.meeting_id = m.id
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
export async function listMembership(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT mem.id, mem.profile_id, m.id as meeting_id,
        m.name as meeting_name, m.info as meeting_info, mem.is_host,
        mem.enabled, mem.created_at, mem.updated_at
      FROM membership mem
        JOIN meeting m ON mem.meeting_id = m.id
      WHERE mem.identity_id = $1
      ORDER BY m.name, mem.created_at
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingMembership[];
}

// -----------------------------------------------------------------------------
export async function addMembershipByInvite(
  identityId: string,
  profileId: string,
  inviteCode: string,
) {
  const sql = {
    text: `
      INSERT INTO membership (identity_id, profile_id, meeting_id, is_host)
      VALUES (
        $1,
        (SELECT id
         FROM profile
         WHERE id = $2
           AND identity_id = $1),
        (SELECT meeting_id
         FROM invite
         WHERE code = $3
           AND enabled = true
           AND expired_at > now()),
        (SELECT as_host
         FROM invite
         WHERE code = $3
           AND enabled = true
           AND expired_at > now()))
      RETURNING id, created_at as at`,
    args: [
      identityId,
      profileId,
      inviteCode,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delMembership(
  identityId: string,
  membershipId: string,
) {
  const sql = {
    text: `
      DELETE FROM membership
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
export async function updateMembership(
  identityId: string,
  membershipId: string,
  profileId: string,
) {
  // meeting_id is not updatable
  const sql = {
    text: `
      UPDATE membership
      SET
        profile_id= (SELECT id
                     FROM profile
                     WHERE id = $3
                       AND identity_id = $1),
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
