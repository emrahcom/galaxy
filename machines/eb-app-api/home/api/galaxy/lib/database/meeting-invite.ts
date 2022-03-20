import { fetch } from "./common.ts";
import type { Id, MeetingInvite, MeetingInvitePublic } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getInvite(identityId: string, inviteId: string) {
  const sql = {
    text: `
      SELECT i.id, i.name, m.id as meeting_id, m.name as meeting_name,
        m.info as meeting_info, i.code, i.as_host, i.disposable, i.enabled,
        i.created_at, i.updated_at, i.expired_at
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
export async function getInviteByCode(code: string) {
  const sql = {
    text: `
      SELECT m.name as meeting_name, m.info as meeting_info, i.code,
        i.as_host, i.expired_at
      FROM meeting_invite i
        JOIN meeting m ON i.meeting_id = m.id
      WHERE i.code = $1
        AND i.enabled = true
        AND i.expired_at > now()`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as MeetingInvitePublic[];
}

// -----------------------------------------------------------------------------
export async function listInvite(
  identityId: string,
  meetingId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT id, name, code, as_host, disposable, enabled, created_at,
        updated_at, expired_at
      FROM meeting_invite
      WHERE identity_id = $1
        AND meeting_id = $2
        AND expired_at > now()
      ORDER BY as_host, expired_at
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
export async function addInvite(
  identityId: string,
  meetingId: string,
  name: string,
  asHost: boolean,
  disposable: boolean,
) {
  const sql = {
    text: `
      INSERT INTO meeting_invite (identity_id, meeting_id, name, as_host,
        disposable)
      VALUES (
        $1,
        (SELECT id
         FROM meeting
         WHERE id = $2
           AND identity_id = $1
        ),
        $3, $4, $5
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      meetingId,
      name,
      asHost,
      disposable,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delInvite(identityId: string, inviteId: string) {
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
export async function updateInviteEnabled(
  identityId: string,
  inviteId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE meeting_invite
      SET
        enabled = $3,
        updated_at = now()
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
