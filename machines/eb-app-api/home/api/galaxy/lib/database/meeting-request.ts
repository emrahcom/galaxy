import { fetch } from "./common.ts";
import type { Id, MeetingRequest } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getRequest(identityId: string, requestId: string) {
  const sql = {
    text: `
      SELECT req.id, pr.id as profile_id, pr.name as profile_name,
        m.id as meeting_id, m.name as meeting_name, req.status, req.created_at,
        req.updated_at, req.expired_at
      FROM meeting_request req
        JOIN meeting m ON req.meeting_id = m.id
        LEFT JOIN profile pr ON req.profile_id = pr.id
      WHERE req.id = $2
        AND req.identity_id = $1`,
    args: [
      identityId,
      requestId,
    ],
  };

  return await fetch(sql) as MeetingRequest[];
}

// -----------------------------------------------------------------------------
export async function listRequest(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT req.id, pr.id as profile_id, pr.name as profile_name,
        m.id as meeting_id, m.name as meeting_name, req.status, req.created_at,
        req.updated_at, req.expired_at
      FROM meeting_request req
        JOIN meeting m ON req.meeting_id = m.id
        LEFT JOIN profile pr ON req.profile_id = pr.id
      WHERE req.identity_id = $1
      ORDER BY req.status, meeting_name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingRequest[];
}

// -----------------------------------------------------------------------------
export async function addRequest(
  identityId: string,
  profileId: string,
  meetingId: string,
) {
  const sql = {
    text: `
      INSERT INTO meeting_request (identity_id, profile_id, meeting_id)
      VALUES (
        $1,
        (SELECT id
         FROM profile
         WHERE id = $2
           AND identity_id = $1
        ),
        (SELECT id
         FROM meeting
         WHERE id = $3
           AND restricted
           AND subscribable
           AND NOT EXISTS (SELECT 1
                           FROM meeting_member
                           WHERE identity_id = $1
                             AND meeting_id = $3
                          )
        )
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      profileId,
      meetingId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delRequest(identityId: string, requestId: string) {
  const sql = {
    text: `
      DELETE FROM meeting_request
      WHERE id = $2
        AND identity_id = $1
        AND status = 'pending'
      RETURNING id, now() as at`,
    args: [
      identityId,
      requestId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateRequest(
  identityId: string,
  requestId: string,
  profileId: string,
) {
  const sql = {
    text: `
      UPDATE meeting_request
      SET
        profile_id = (SELECT id
                      FROM profile
                      WHERE id = $3
                        AND identity_id = $1
                     ),
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
        AND status = 'pending'
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      requestId,
      profileId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function acceptRequest(identityId: string, requestId: string) {
  const sql = {
    text: `
      INSERT INTO meeting_member (identity_id, profile_id, meeting_id)
      VALUES (
        (SELECT identity_id
         FROM meeting_request
         WHERE id = $2
        ),
        (SELECT profile_id
         FROM meeting_request
         WHERE id = $2
        ),
        (SELECT meeting_id
         FROM meeting_request req
         WHERE id = $2
           AND EXISTS (SELECT 1
                       FROM meeting
                       WHERE id = req.meeting_id
                         AND identity_id = $1
                      )
        )
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      requestId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function rejectRequest(identityId: string, requestId: string) {
  const sql = {
    text: `
      UPDATE meeting_request req
      SET
        status = 'rejected',
        expired_at = now() + interval '7 days',
        updated_at = now()
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = req.meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      requestId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function dropRequest(identityId: string, requestId: string) {
  const sql = {
    text: `
      DELETE FROM meeting_request req
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = req.meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, now() as at`,
    args: [
      identityId,
      requestId,
    ],
  };

  return await fetch(sql) as Id[];
}
